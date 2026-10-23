// ⌘K 构建期索引的条目（/search.json、/{locale}/search.json）
export interface SearchItem {
  // Tool id 或 Variant 的 "<tool>/<variant>"，用于对应本地的收藏和最近使用
  id: string;
  name: string;
  summary: string;
  path: string;
}
