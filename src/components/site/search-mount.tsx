import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import SearchDialog from "./SearchDialog";

let toggle: (() => void) | undefined;

function SearchRoot({ indexUrl }: { indexUrl: string }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    toggle = () => setOpen((value) => !value);
  }, []);
  return <SearchDialog open={open} onOpenChange={setOpen} indexUrl={indexUrl} />;
}

// 第一次调用时挂载并打开对话框，之后切换开关
export const toggleSearch = (indexUrl: string) => {
  if (toggle) return toggle();
  const container = document.createElement("div");
  document.body.append(container);
  createRoot(container).render(<SearchRoot indexUrl={indexUrl} />);
};
