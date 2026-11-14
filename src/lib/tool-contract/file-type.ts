import * as v from "valibot";

// MIME 类型 → 该类型文件的扩展名（小写，带点），例如 { "video/x-matroska": [".mkv"] }
export type FileTypes = Readonly<Record<string, readonly `.${string}`[]>>;

export interface FileTypeIssue extends v.BaseIssue<File> {
  readonly kind: "transformation";
  readonly type: "file_type";
  readonly expected: string;
  readonly requirement: FileTypes;
}

export interface FileTypeAction extends v.BaseTransformation<File, File, FileTypeIssue> {
  readonly type: "file_type";
  readonly reference: typeof fileType;
  readonly expects: string;
  readonly requirement: FileTypes;
}

const extensionOf = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot).toLowerCase() : "";
};

// 声明能接受的文件类型（代替 v.mimeType）。浏览器给的 File.type 不可靠：Firefox、Safari 选中 .mkv 时是空字符串，
// Chrome 报 video/matroska 而不是常见的 video/x-matroska。所以 MIME 类型不在列表里时再按扩展名判断，
// 通过后把 File 的 type 改成表里的 MIME 类型，core 拿到的类型总是表里的某一个。
// 表单的 accept 同时列出 MIME 类型和扩展名（fields.ts）；只校验名字和声明的类型，内容是否有效由 core 判断。
export const fileType = (requirement: FileTypes): FileTypeAction => ({
  kind: "transformation",
  type: "file_type",
  reference: fileType,
  async: false,
  expects: Object.keys(requirement).join(" | "),
  requirement,
  "~run"(dataset, config) {
    const file = dataset.value;
    if (Object.hasOwn(this.requirement, file.type)) return dataset;
    const extension = extensionOf(file.name);
    const type = Object.keys(this.requirement).find((key) =>
      this.requirement[key]!.includes(extension as `.${string}`),
    );
    if (!type) {
      // oxlint-disable-next-line eslint/no-underscore-dangle -- Valibot 导出给自定义 action 用的工具函数，内置 action 也用它报错
      v._addIssue(this, "file type", dataset, config, {
        received: `"${file.type || extension}"`,
      });
      // transformation 失败要自己标记为未通过，后续的校验（如 maxSize）才会跳过
      const failed = dataset as unknown as v.OutputDataset<File, FileTypeIssue>;
      failed.typed = false;
      return failed;
    }
    dataset.value = new File([file], file.name, { type, lastModified: file.lastModified });
    return dataset;
  },
});

// 表单 accept 属性的取值：MIME 类型在前，扩展名在后
export const acceptOf = (requirement: FileTypes) => [
  ...Object.keys(requirement),
  ...new Set(Object.values(requirement).flat()),
];
