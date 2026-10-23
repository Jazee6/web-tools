import { useForm } from "@tanstack/react-form";
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

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { registerWebMcpTool } from "@/lib/agent/webmcp";
import { type AnyTool, type Capability, loadRun, ToolError } from "@/lib/tool-contract/define-tool";
import { describeFields, type FieldSpec, initialValues } from "@/lib/tool-contract/fields";
import { m } from "@/paraglide/messages";

import { invokeTool } from "./invoke";
import { type OutputLabel, ToolOutput } from "./ToolOutput";
import { getTurnstileToken, loadTurnstile } from "./turnstile";

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

type Values = Record<string, unknown>;

// 字段级错误：Valibot 校验失败的路径，或 core 抛出的 ToolError（code 与字段同名时显示在该字段下）
interface RunError {
  field?: string;
  message: string;
}

const noopSubscribe = () => () => {};

const Unsupported = lazy(() => import("./Unsupported"));

const issueMessage = (issue: v.BaseIssue<unknown>) =>
  issue.type === "non_empty" || issue.type === "min_length" || issue.input === undefined
    ? m.form_required()
    : m.form_invalid();

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
}: {
  tool: AnyTool;
  strings: ToolStrings;
  agent?: ToolAgentProps;
  server?: ToolServerProps;
}) {
  const fields = useMemo(() => describeFields(tool.input), [tool]);
  const outputFields = useMemo(() => describeFields(tool.output), [tool]);
  const [output, setOutput] = useState<Values>();
  const [runError, setRunError] = useState<RunError>();
  const server = tool.runtime.where === "server";
  // Server-assisted Tool 的 Turnstile widget 渲染在这里（需要交互时才可见）
  const challenge = useRef<HTMLDivElement>(null);
  const siteKey = serverProps?.turnstileSiteKey ?? "";
  const getToken = useCallback(() => getTurnstileToken(challenge.current!, siteKey), [siteKey]);
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
    const preload = () => void loadTurnstile().catch(() => {});
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

  // 空闲时预取轻量 Tool 的 core，首次提交不用再等网络；requestIdleCallback 不可用时（Safari）退回 setTimeout。
  // Server-assisted Tool 的 core 只在服务端运行，重型 Tool 的 core 在 Worker 里加载，都不预取。
  useEffect(() => {
    if (server || tool.runtime.worker) return;
    const prefetch = () => void loadRun(tool);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(prefetch);
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(prefetch, 1);
    return () => clearTimeout(id);
  }, [tool, server]);

  const form = useForm({
    defaultValues: initialValues(tool.input),
    validators: {
      onSubmit: ({ value }) => {
        const result = v.safeParse(tool.input, value);
        if (result.success) return undefined;
        const errors: Record<string, string> = {};
        for (const issue of result.issues) {
          const key = v.getDotPath(issue);
          if (key && !errors[key]) errors[key] = issueMessage(issue);
        }
        return { fields: errors };
      },
    },
    onSubmit: async ({ value }) => {
      setRunError(undefined);
      try {
        setOutput(await invokeTool(tool, v.parse(tool.input, value), getToken));
      } catch (error) {
        setOutput(undefined);
        const message = errorMessage(error, strings);
        if (!message) console.error(error);
        setRunError({
          field: error instanceof ToolError ? error.field : undefined,
          message: message ?? m.tool_error(),
        });
      }
    },
  });

  // WebMCP：把当前 Tool 注册给页面内的 agent，执行结果同步显示在表单上；卸载时注销
  useEffect(() => {
    if (!agent || !tool.agent.webmcp) return;
    const controller = new AbortController();
    void registerWebMcpTool(
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
          <Switch
            id={id}
            name={field.name}
            checked={Boolean(field.state.value)}
            aria-invalid={invalid}
            onCheckedChange={(checked) => onChange(checked)}
          />
        );
      case "select": {
        const items = spec.options.map((option) => ({
          value: option,
          label: label?.options?.[option] ?? option,
        }));
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
        // 文件输入不能受控，只把选中的 File 交给表单
        return (
          <Input
            id={id}
            name={field.name}
            type="file"
            accept={spec.accept.join(",")}
            aria-invalid={invalid}
            onBlur={field.handleBlur}
            onChange={(event) => onChange(event.target.files?.[0])}
          />
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
                <Field orientation="horizontal">
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Spinner />}
                    {strings.action}
                  </Button>
                </Field>
              )}
            </form.Subscribe>
          </FieldGroup>
        </FieldSet>
        {server && <div ref={challenge} />}
      </form>

      {runError && !runError.field && (
        <Alert variant="destructive">
          <AlertDescription>{runError.message}</AlertDescription>
        </Alert>
      )}

      {output &&
        outputFields.map((spec) => (
          <ToolOutput
            key={spec.name}
            spec={spec}
            value={output[spec.name]}
            label={strings.output[spec.name]}
          />
        ))}
    </div>
  );
}
