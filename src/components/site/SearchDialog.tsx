import { useEffect, useState } from "react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { SearchItem } from "@/lib/search";
import { m } from "@/paraglide/messages";

let cache: Promise<SearchItem[]> | undefined;

const loadIndex = (url: string) =>
  (cache ??= fetch(url).then((response) => response.json() as Promise<SearchItem[]>));

function SearchResults({ indexUrl }: { indexUrl: string }) {
  const [items, setItems] = useState<SearchItem[]>();

  useEffect(() => {
    void loadIndex(indexUrl).then(setItems);
  }, [indexUrl]);

  return (
    <Command>
      <CommandInput placeholder={m.search_placeholder()} />
      <CommandList>
        {items ? (
          <>
            <CommandEmpty>{m.search_empty()}</CommandEmpty>
            {items.map((item) => (
              <CommandItem
                key={item.path}
                value={item.path}
                keywords={[item.name, item.summary]}
                onSelect={() => location.assign(item.path)}
              >
                <div className="flex flex-col gap-1">
                  <span>{item.name}</span>
                  <span className="line-clamp-1 text-muted-foreground">{item.summary}</span>
                </div>
              </CommandItem>
            ))}
          </>
        ) : (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        )}
      </CommandList>
    </Command>
  );
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  indexUrl: string;
}

// 桌面端用 Dialog，移动端用 Drawer（UI 规则）
export default function SearchDialog({ open, onOpenChange, indexUrl }: Props) {
  const desktop = useMediaQuery("(min-width: 768px)");

  if (desktop) {
    return (
      <CommandDialog open={open} onOpenChange={onOpenChange} title={m.search_open()} description="">
        <SearchResults indexUrl={indexUrl} />
      </CommandDialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>{m.search_open()}</DrawerTitle>
        </DrawerHeader>
        <SearchResults indexUrl={indexUrl} />
      </DrawerContent>
    </Drawer>
  );
}
