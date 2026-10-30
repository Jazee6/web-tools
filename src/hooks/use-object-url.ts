import { useEffect, useMemo } from "react";

// 文件的 object URL：随文件更新或卸载释放。只在客户端渲染文件之后使用（服务端没有 URL.createObjectURL）
export const useObjectUrl = (file: Blob): string => {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return url;
};
