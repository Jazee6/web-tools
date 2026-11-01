import { useForm, useStore } from "@tanstack/react-form";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import * as v from "valibot";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { getModelContext } from "@/lib/agent/model-context";
import { setActiveTool } from "@/lib/telemetry/client";
import {
  type AnyTool,
  type Capability,
  loadRun,
  type ProgressStage,
  ToolError,
} from "@/lib/tool-contract/define-tool";
import {
  describeFields,
  type FieldSpec,
  initialValues,
  isPreferenceField,
} from "@/lib/tool-contract/fields";
import { m } from "@/paraglide/messages";

import type { Estimates } from "./FilesInput";
import { invokeTool } from "./invoke";
import { selectItems } from "./select-items";
import type { OutputLabel } from "./ToolOutput";

interface Label {
  label: string;
  placeholder?: string;
}

// 当前 Locale 的 Tool 文案，来自内容 frontmatter（由页面作为 props 传入）
export interface ToolStrings {
  action: string;
  fields: Record<string, Label & { options?: Record<string, string> }>;
  output: Record<string, OutputLabel>;
  errors: Record<string, string>;
}

// WebMCP 注册所需、构建期从契约派生的数据（JSON Schema 不在浏览器里生成，避免打包 @valibot/to-json-schema）
export interface ToolAgentProps {
  inputSchema: object;
}

// 只有 Server-assisted Tool 页需要的运行时配置，构建期从 Worker vars 读出
export interface ToolServerProps {
  turnstileSiteKey: string;
}

// Variant 页的预设（architecture §11）：preset 覆盖 schema 默认值，并且优先于本地偏好；
// accept 是收窄后的文件选择器类型（MIME 类型和扩展名），校验仍按 Tool 的全部类型（ADR-0020）
export interface ToolPresetProps {
  preset: Record<string, unknown>;
  accept: Record<string, string[]>;
}

type Values = Record<string, unknown>;

// 字段级错误：Valibot 校验失败的路径，或 core 抛出的 ToolError（code 与字段同名时显示在该字段下）
interface RunError {
  field?: string;
  message: string;
}

// 多文件输出对应的输入：第一个多文件输入字段，且文件数与输出一致
const sourcesOf = (inputFields: FieldSpec[], input: Values | undefined, output: unknown) => {
  const name = inputFields.find((spec) => spec.kind === "files")?.name;
  const files = name && input?.[name];
  return Array.isArray(files) && Array.isArray(output) && files.length === output.length
    ? (files as File[])
    : undefined;
};

const noEstimates: Estimates = new Map();

const noopSubscribe = () => () => {};

const Unsupported = lazy(() => import("./Unsupported"));
const FilesInput = lazy(() => import("./FilesInput"));
const FilePreview = lazy(() => import("./FilePreview"));
const RunProgress = lazy(() => import("./RunProgress"));
// 只有少数 Tool 有开关字段，只有 Server-assisted Tool 用 Turnstile，都不进其他 Tool 页的首屏（architecture §15）
const Switch = lazy(() =>
  import("@/components/ui/switch").then((module) => ({ default: module.Switch })),
);
const loadTurnstileModule = () => import("./turnstile");
// 运行出错和页面内有 agent 时才需要，不进首屏；错误提示空闲时预取，离线时也能显示
const loadRunErrorAlert = () => import("./RunErrorAlert");
const RunErrorAlert = lazy(loadRunErrorAlert);
// 输出区域在第一次运行后才显示，不进首屏（architecture §15），空闲时预取
const loadToolOutput = () => import("./ToolOutput");
const ToolOutput = lazy(loadToolOutput);

const issueMessage = (issue: v.BaseIssue<unknown>) => {
  // 多文件字段的数量限制
  if (Array.isArray(issue.input) && issue.type === "min_length" && Number(issue.requirement) > 1) {
    return m.form_files_min({ count: String(issue.requirement) });
  }
  if (Array.isArray(issue.input) && issue.type === "max_length") {
    return m.form_files_max({ count: String(issue.requirement) });
  }
  if (issue.type === "non_empty" || issue.type === "min_length" || issue.input === undefined) {
    return m.form_required();
  }
  if (issue.type === "max_size") return m.form_file_too_large();
  if (issue.type === "file_type") return m.form_file_type();
  return m.form_invalid();
};

// 平台级错误码（/api/tools 返回）的文案在 messages，Tool 自身的错误码文案在内容 frontmatter
const platformErrors: Record<string, () => string> = {
  rate_limited: m.tool_rate_limited,
  verification_failed: m.tool_verification_failed,
  invalid_input: m.form_invalid,
};

const errorMessage = (error: unknown, strings: ToolStrings): string | undefined => {
  if (!(error instanceof ToolError)) return undefined;
  const message = strings.errors[error.code] ?? platformErrors[error.code]?.();
  if (!message) return undefined;
  return strings.errors[error.code] ? [message, error.detail].filter(Boolean).join(" ") : message;
};

export function ToolForm({
  tool,
  strings,
  agent,
  server: serverProps,
  variant,
}: {
  tool: AnyTool;
  strings: ToolStrings;
  agent?: ToolAgentProps;
  server?: ToolServerProps;
  variant?: ToolPresetProps;
}) {
  const fields = useMemo(() => describeFields(tool.input), [tool]);
  const outputFields = useMemo(() => describeFields(tool.output), [tool]);
  // 预设的字段不恢复也不保存本地偏好：Variant 页总是按预设打开，也不改变 Tool 页记住的选项
  const preferenceNames = useMemo(
    () =>
      fields
        .filter((spec) => isPreferenceField(spec) && !(spec.name in (variant?.preset ?? {})))
        .map((spec) => spec.name),
    [fields, variant],
  );
  const defaultValues = useMemo(
    () => ({ ...initialValues(tool.input), ...variant?.preset }),
    [tool, variant],
  );
  const [output, setOutput] = useState<Values>();
  // 产生 output 的那次输入，多文件输出用它对照体积
  const [submitted, setSubmitted] = useState<Values>();
  const [runError, setRunError] = useState<RunError>();
  // Worker Tool 运行中回报的进度（0–1）与取消用的 controller
  const [progress, setProgress] = useState<{ ratio: number; stage?: ProgressStage }>();
  const running = useRef<AbortController>(undefined);
  const server = tool.runtime.where === "server";
  // Server-assisted Tool 的 Turnstile widget 渲染在这里（需要交互时才可见）
  const challenge = useRef<HTMLDivElement>(null);
  const siteKey = serverProps?.turnstileSiteKey ?? "";
  const getToken = useCallback(
    async () => (await loadTurnstileModule()).getTurnstileToken(challenge.current!, siteKey),
    [siteKey],
  );
  const formRef = useRef<HTMLFormElement>(null);
  // 水合后探测到的缺失能力；有缺失时用 Empty 代替表单
  const [missing, setMissing] = useState<Capability[]>([]);

  // 服务端与水合阶段为 false，水合完成后为 true（e2e 据此等待可交互）
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  // Server-assisted Tool：首次聚焦表单时预取 Turnstile 脚本，提交时不用再等
  useEffect(() => {
    const element = formRef.current;
    if (!server || !element) return;
    const preload = () =>
      void loadTurnstileModule()
        .then(({ loadTurnstile }) => loadTurnstile())
        .catch(() => {});
    element.addEventListener("focusin", preload, { once: true });
    return () => element.removeEventListener("focusin", preload);
  }, [server]);

  // 能力探测放在水合之后，服务端与首次渲染的 HTML 一致
  useEffect(() => {
    const required = tool.runtime.requires ?? [];
    if (required.length === 0) return;
    let active = true;
    void import("@/lib/runtime/capabilities")
      .then(({ missingCapabilities }) => missingCapabilities(required))
      .then((result) => active && setMissing(result));
    return () => {
      active = false;
    };
  }, [tool]);

  // 重型引擎在首次交互时才预热 Worker（下载脚本），WASM 等到真正编码时才加载
  useEffect(() => {
    const element = formRef.current;
    if (!tool.runtime.worker || !element) return;
    const warm = () => void import("./tool-worker").then(({ warmWorker }) => warmWorker(tool));
    element.addEventListener("focusin", warm, { once: true });
    return () => element.removeEventListener("focusin", warm);
  }, [tool]);

  useEffect(() => setActiveTool(tool.id), [tool.id]);

  // 空闲时预取输出区域和轻量 Tool 的 core，首次提交不用再等网络；requestIdleCallback 不可用时（Safari）退回 setTimeout。
  // Server-assisted Tool 的 core 只在服务端运行，重型 Tool 的 core 在 Worker 里加载，都不预取。
  useEffect(() => {
    const prefetch = () => {
      void loadToolOutput();
      void loadRunErrorAlert();
      if (!server && !tool.runtime.worker) void loadRun(tool);
    };
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(prefetch);
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(prefetch, 1);
    return () => clearTimeout(id);
  }, [tool, server]);

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: ({ value }) => {
        const result = v.safeParse(tool.input, value);
        if (result.success) return undefined;
        const errors: Record<string, string> = {};
        // 错误挂在顶层字段上；多文件字段里某个文件不合格时，在文案前加上文件名
        for (const issue of result.issues) {
          const [field, item] = issue.path ?? [];
          const key = field?.key as string | undefined;
          if (!key || errors[key]) continue;
          const message = issueMessage(issue);
          errors[key] = item?.value instanceof File ? `${item.value.name}: ${message}` : message;
        }
        return { fields: errors };
      },
    },
    onSubmit: async ({ value }) => {
      setRunError(undefined);
      const controller = new AbortController();
      running.current = controller;
      try {
        const input = v.parse(tool.input, value) as Values;
        setOutput(
          await invokeTool(tool, input, getToken, {
            signal: controller.signal,
            onProgress: (ratio, stage) => setProgress({ ratio, stage }),
          }),
        );
        setSubmitted(input);
        // 记入最近使用并保存选项；IndexedDB 不可用时忽略
        void import("./preferences")
          .then(({ rememberRun }) => rememberRun(tool.id, preferenceNames, value))
          .catch(() => {});
      } catch (error) {
        setOutput(undefined);
        // 用户主动取消，不算错误
        if (controller.signal.aborted) return;
        const message = errorMessage(error, strings);
        if (!message) console.error(error);
        setRunError({
          field: error instanceof ToolError ? error.field : undefined,
          message: message ?? m.tool_error(),
        });
      } finally {
        running.current = undefined;
        setProgress(undefined);
      }
    },
  });

  // 提交前的体积预估（Tool 契约的 estimate）：文件或选项变化后防抖，在 Worker 里采样编码；
  // 过期的预估随输入变化中止，提交期间暂停。非预估 Tool 订阅的是常量，不会引起重渲染
  const estimateField = tool.estimate?.field;
  const formValues = useStore(form.store, (state) => (estimateField ? state.values : undefined));
  const formSubmitting = useStore(form.store, (state) => state.isSubmitting);
  // 输入有效且选了文件才预估
  const estimateRequest = useMemo(() => {
    if (!estimateField || !formValues) return undefined;
    const parsed = v.safeParse(tool.input, formValues);
    return parsed.success ? (parsed.output as Values) : undefined;
  }, [tool, estimateField, formValues]);
  const [estimated, setEstimated] = useState<{ request: Values; sizes: Estimates }>();
  useEffect(() => {
    if (!estimateRequest || !estimateField || formSubmitting) return;
    const files = estimateRequest[estimateField] as File[];
    if (files.length === 0) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      void import("./tool-worker")
        .then(({ estimateInWorker }) =>
          estimateInWorker(tool, estimateRequest, { signal: controller.signal }),
        )
        .then((sizes) =>
          setEstimated({
            request: estimateRequest,
            sizes: new Map(files.map((file, index) => [file, sizes[index]!])),
          }),
        )
        .catch(() => {
          // 预估只是参考：中止是常态，其他错误（如不支持的文件）提交时会有明确提示
          if (!controller.signal.aborted)
            setEstimated({ request: estimateRequest, sizes: new Map() });
        });
    }, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [tool, estimateField, estimateRequest, formSubmitting]);
  // 输入变了、新预估还没回来时，旧结果不再显示
  const estimateCurrent = estimated !== undefined && estimated.request === estimateRequest;
  const estimateSizes = estimateCurrent ? estimated.sizes : noEstimates;
  const estimatePending =
    estimateRequest !== undefined &&
    (estimateRequest[estimateField!] as File[]).length > 0 &&
    !estimateCurrent;

  // 水合后恢复上次用过的选项（服务端与首次渲染都用 schema 默认值）
  useEffect(() => {
    let active = true;
    if (preferenceNames.length === 0) return;
    const initial = form.options.defaultValues as Values;
    void import("./preferences")
      .then(({ restorePreferences }) =>
        restorePreferences(
          tool.id,
          {
            names: preferenceNames,
            untouched: (name) => form.getFieldValue(name as never) === initial[name],
            accepts: (name, value) => v.is(tool.input.entries[name], value),
            set: (name, value) => form.setFieldValue(name as never, value as never),
          },
          () => active,
        ),
      )
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [tool, form, preferenceNames]);

  // WebMCP：把当前 Tool 注册给页面内的 agent，执行结果同步显示在表单上；卸载时注销
  useEffect(() => {
    if (!agent || !tool.agent.webmcp || !getModelContext()) return;
    const controller = new AbortController();
    void import("@/lib/agent/webmcp").then(({ registerWebMcpTool }) =>
      registerWebMcpTool(
        {
          name: tool.id,
          description: tool.agent.description,
          inputSchema: agent.inputSchema,
          annotations: { readOnlyHint: true, untrustedContentHint: server },
          execute: async (args) => {
            const parsed = v.safeParse(tool.input, args);
            if (!parsed.success) {
              const issues = parsed.issues.map((issue) => ({
                path: v.getDotPath(issue),
                message: issue.message,
              }));
              return JSON.stringify({ error: { code: "invalid_input", issues } });
            }
            for (const [name, value] of Object.entries(parsed.output)) {
              form.setFieldValue(name, value as never);
            }
            try {
              const result = await invokeTool(tool, parsed.output, getToken);
              setRunError(undefined);
              setOutput(result);
              return JSON.stringify(result);
            } catch (error) {
              if (!(error instanceof ToolError)) throw error;
              const { code, field, detail } = error;
              return JSON.stringify({
                error: { code, field, detail, message: errorMessage(error, strings) },
              });
            }
          },
        },
        controller.signal,
      ),
    );
    return () => controller.abort();
  }, [agent, tool, server, form, getToken, strings]);

  const renderControl = (
    spec: FieldSpec,
    field: {
      name: string;
      state: { value: unknown };
      handleChange: (value: never) => void;
      handleBlur: () => void;
    },
    invalid: boolean,
  ) => {
    const label = strings.fields[spec.name];
    const id = `tool-${spec.name}`;
    const onChange = (value: unknown) => {
      if (runError?.field === spec.name) setRunError(undefined);
      field.handleChange(value as never);
    };
    switch (spec.kind) {
      case "url":
        return (
          <Input
            id={id}
            name={field.name}
            type="url"
            inputMode="url"
            autoComplete="url"
            value={String(field.state.value)}
            placeholder={label?.placeholder}
            aria-invalid={invalid}
            spellCheck={false}
            onBlur={field.handleBlur}
            onChange={(event) => onChange(event.target.value)}
          />
        );
      case "line":
        return (
          <Input
            id={id}
            name={field.name}
            value={String(field.state.value)}
            placeholder={label?.placeholder}
            aria-invalid={invalid}
            spellCheck={false}
            onBlur={field.handleBlur}
            onChange={(event) => onChange(event.target.value)}
          />
        );
      case "code":
      case "text":
        return (
          <Textarea
            id={id}
            name={field.name}
            value={String(field.state.value)}
            placeholder={label?.placeholder}
            aria-invalid={invalid}
            spellCheck={false}
            variant={spec.kind === "code" ? "code" : "default"}
            onBlur={field.handleBlur}
            onChange={(event) => onChange(event.target.value)}
          />
        );
      case "number":
        return (
          <Input
            id={id}
            name={field.name}
            type="number"
            value={String(field.state.value)}
            aria-invalid={invalid}
            onBlur={field.handleBlur}
            onChange={(event) => onChange(event.target.valueAsNumber)}
          />
        );
      case "boolean":
        return (
          // 水合时 React 可能先渲染 fallback（见下面 FilesInput 的说明），占位与开关同尺寸
          <Suspense fallback={<span className="h-5 w-11 shrink-0" />}>
            <Switch
              id={id}
              name={field.name}
              checked={Boolean(field.state.value)}
              aria-invalid={invalid}
              onCheckedChange={(checked) => onChange(checked)}
            />
          </Suspense>
        );
      case "select": {
        const items = selectItems(spec, label?.options);
        return (
          <Select
            id={id}
            name={field.name}
            items={items}
            value={field.state.value as string}
            onValueChange={(value) => onChange(value)}
          >
            <SelectTrigger aria-invalid={invalid}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value} data-option={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      case "file":
        // 文件输入不能受控，只把选中的 File 交给表单；图片 / 视频在下方预览
        return (
          <>
            <Input
              id={id}
              name={field.name}
              type="file"
              accept={(variant?.accept[spec.name] ?? spec.accept).join(",")}
              aria-invalid={invalid}
              onBlur={field.handleBlur}
              onChange={(event) => onChange(event.target.files?.[0])}
            />
            {field.state.value instanceof File && (
              <Suspense>
                <FilePreview file={field.state.value} size="lg" />
              </Suspense>
            )}
          </>
        );
      case "files":
        return (
          // hydrated 状态更新会打断还没水合完的 Suspense 边界，React 先渲染 fallback 再等分块加载；
          // fallback 与空的文件输入框同尺寸同外观，字段不会折叠（否则页面上下跳动，CLS 超标）
          <Suspense fallback={<div className="h-9 w-full rounded-3xl bg-input/50" />}>
            <FilesInput
              id={id}
              name={field.name}
              accept={variant?.accept[spec.name] ?? spec.accept}
              files={field.state.value as File[]}
              invalid={invalid}
              estimates={spec.name === estimateField ? estimateSizes : undefined}
              estimating={spec.name === estimateField && estimatePending}
              onBlur={field.handleBlur}
              onChange={onChange}
            />
          </Suspense>
        );
      case "table":
        throw new Error(`表格字段 ${spec.name} 只能用于输出`);
    }
  };

  if (missing.length > 0) {
    return (
      <Suspense>
        <Unsupported missing={missing} />
      </Suspense>
    );
  }

  return (
    <div className="flex flex-col gap-6" data-hydrated={hydrated || undefined}>
      <form
        ref={formRef}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <FieldSet>
          <FieldGroup>
            {fields.map((spec) => (
              <form.Field key={spec.name} name={spec.name}>
                {(field) => {
                  const errors = [
                    ...field.state.meta.errors.map((message) => ({ message: String(message) })),
                    ...(runError?.field === spec.name ? [{ message: runError.message }] : []),
                  ];
                  const invalid = errors.length > 0;
                  const label = strings.fields[spec.name]?.label ?? spec.name;
                  const control = renderControl(spec, field, invalid);
                  return spec.kind === "boolean" ? (
                    <Field orientation="horizontal" data-invalid={invalid} data-field={spec.name}>
                      {control}
                      <FieldContent>
                        <FieldLabel htmlFor={`tool-${spec.name}`}>{label}</FieldLabel>
                        <FieldError errors={errors} />
                      </FieldContent>
                    </Field>
                  ) : (
                    <Field data-invalid={invalid} data-field={spec.name}>
                      <FieldLabel htmlFor={`tool-${spec.name}`}>{label}</FieldLabel>
                      {control}
                      <FieldError errors={errors} />
                    </Field>
                  );
                }}
              </form.Field>
            ))}
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(submitting) => (
                <>
                  <Field orientation="horizontal">
                    <Button type="submit" disabled={submitting}>
                      {submitting && <Spinner />}
                      {strings.action}
                    </Button>
                    {/* 只有 Worker Tool 能中途取消（Worker RPC 会把 abort 转给 core） */}
                    {submitting && tool.runtime.worker && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => running.current?.abort()}
                      >
                        {m.tool_cancel()}
                      </Button>
                    )}
                  </Field>
                  {submitting && progress !== undefined && (
                    <Suspense>
                      <RunProgress ratio={progress.ratio} stage={progress.stage} />
                    </Suspense>
                  )}
                </>
              )}
            </form.Subscribe>
          </FieldGroup>
        </FieldSet>
        {server && <div ref={challenge} />}
      </form>

      {runError && !runError.field && (
        <Suspense>
          <RunErrorAlert message={runError.message} />
        </Suspense>
      )}

      {output && (
        <Suspense>
          {outputFields.map((spec) => (
            <ToolOutput
              key={spec.name}
              spec={spec}
              value={output[spec.name]}
              label={strings.output[spec.name]}
              sources={sourcesOf(fields, submitted, output[spec.name])}
              toolId={tool.id}
            />
          ))}
        </Suspense>
      )}
    </div>
  );
}
