import { SearchIcon } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { m } from "@/paraglide/messages";

// 对话框（cmdk + Dialog/Drawer）在第一次打开时才加载
const SearchDialog = lazy(() => import("./SearchDialog"));

export default function SearchCommand({ indexUrl }: { indexUrl: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setMounted(true);
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
      >
        <SearchIcon />
        {m.search_open()}
        <Kbd className="hidden md:inline-flex">⌘K</Kbd>
      </Button>
      {mounted && (
        <Suspense>
          <SearchDialog open={open} onOpenChange={setOpen} indexUrl={indexUrl} />
        </Suspense>
      )}
    </>
  );
}
