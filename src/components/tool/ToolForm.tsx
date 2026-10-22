import { useForm } from "@tanstack/react-form";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
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
import { type AnyTool, ToolError } from "@/lib/tool-contract/define-tool";
import { describeFields, type FieldSpec, initialValues } from "@/lib/tool-contract/fields";
import { m } from "@/paraglide/messages";

interface Label {
  label: string;
  placeholder?: string;
}

// 当前 Locale 的 Tool 文案，来自内容 frontmatter（由页面作为 props 传入）
export interface ToolStrings {
  action: string;
  fields: Record<string, Label & { options?: Record<string, string> }>;
  output: Record<string, Label>;
  errors: Record<string, string>;
}

type Values = Record<string, unknown>;

// 字段级错误：Valibot 校验失败的路径，或 core 抛出的 ToolError（code 与字段同名时显示在该字段下）
interface RunError {
  field?: string;
  message: string;
}

const issueMessage = (issue: v.BaseIssue<unknown>) =>
  issue.type === "non_empty" || issue.type === "min_length" ? m.form_required() : m.form_invalid();

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <InputGroupButton
      variant="ghost"
      onClick={() => navigator.clipboard.writeText(value).then(() => setCopied(true))}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? m.tool_copied() : m.tool_copy()}
    </InputGroupButton>
  );
}

export function ToolForm({ tool, strings }: { tool: AnyTool; strings: ToolStrings }) {
  const fields = useMemo(() => describeFields(tool.input), [tool]);
  const outputFields = useMemo(() => describeFields(tool.output), [tool]);
  const [output, setOutput] = useState<Values>();
  const [runError, setRunError] = useState<RunError>();

  // 空闲时预取 core，首次提交不用再等网络
  useEffect(() => {
    const id = requestIdleCallback(() => void tool.run());
    return () => cancelIdleCallback(id);
  }, [tool]);

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
        const run = await tool.run();
        setOutput(await run(v.parse(tool.input, value), {}));
      } catch (error) {
        setOutput(undefined);
        if (error instanceof ToolError && strings.errors[error.code]) {
          const message = [strings.errors[error.code], error.detail].filter(Boolean).join(" ");
          setRunError({ field: error.field, message });
        } else {
          console.error(error);
          setRunError({ message: m.tool_error() });
        }
      }
    },
  });

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
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form
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
      </form>

      {runError && !runError.field && (
        <Alert variant="destructive">
          <AlertDescription>{runError.message}</AlertDescription>
        </Alert>
      )}

      {output &&
        outputFields.map((spec) => {
          const value = String(output[spec.name] ?? "");
          return (
            <Field key={spec.name} data-output={spec.name}>
              <FieldLabel htmlFor={`tool-output-${spec.name}`}>
                {strings.output[spec.name]?.label ?? spec.name}
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  id={`tool-output-${spec.name}`}
                  readOnly
                  value={value}
                  spellCheck={false}
                  variant={spec.kind === "code" ? "code" : "default"}
                />
                <InputGroupAddon align="block-end" className="justify-end">
                  <CopyButton value={value} />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          );
        })}
    </div>
  );
}
