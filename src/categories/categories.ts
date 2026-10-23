// Category 是封闭集合，顺序即站内展示顺序；名称、简介等内容在 ./<id>/{locale}.md。
export const categoryIds = ["developer", "image", "pdf"] as const;

export type CategoryId = (typeof categoryIds)[number];
