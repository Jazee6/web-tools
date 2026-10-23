import { StarIcon, StarOffIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { listFavorites, listRecents, setFavorite } from "@/lib/runtime/local-store";
import type { SearchItem } from "@/lib/search";
import { m } from "@/paraglide/messages";

let cache: Promise<SearchItem[]> | undefined;

const loadIndex = (url: string) =>
  (cache ??= fetch(url).then((response) => response.json() as Promise<SearchItem[]>));

// 本地的收藏和最近使用（Tool id，新的在前）；IndexedDB 不可用时为空
const useLocalLists = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  useEffect(() => {
    void Promise.all([listFavorites(), listRecents()])
      .then(([favoriteItems, recentItems]) => {
        setFavorites(favoriteItems.map((item) => item.id));
        setRecents(recentItems.map((item) => item.id));
      })
      .catch(() => {});
  }, []);
  const toggleFavorite = (id: string) => {
    const favorite = !favorites.includes(id);
    void setFavorite(id, favorite)
      .then(() =>
        setFavorites((list) =>
          favorite ? [id, ...list] : list.filter((existing) => existing !== id),
        ),
      )
      .catch(() => {});
  };
  return { favorites, recents, toggleFavorite };
};

// 最近使用只列前几条
const RECENTS_SHOWN = 5;

interface ToolRowProps {
  item: SearchItem;
  group: string;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
}

// 同一个 Tool 可能同时出现在收藏、最近使用和全部工具里，value 加前缀区分（cmdk 按 value 定位选中项）。
// 行尾的星标按钮给鼠标和触屏用；键盘用户通过当前 Tool 的收藏操作项收藏（焦点始终在搜索框里）
function ToolRow({ item, group, favorite, onToggleFavorite }: ToolRowProps) {
  const label = favorite
    ? m.favorite_remove({ name: item.name })
    : m.favorite_add({ name: item.name });
  // 阻止冒泡，点星标不触发整行的跳转
  const stop = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <CommandItem
      value={`${group}:${item.path}`}
      keywords={[item.name, item.summary]}
      onSelect={() => location.assign(item.path)}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span>{item.name}</span>
        <span className="line-clamp-1 text-muted-foreground">{item.summary}</span>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        tabIndex={-1}
        aria-label={label}
        aria-pressed={favorite}
        data-favorite={item.id}
        onPointerDown={stop}
        onClick={(event) => {
          stop(event);
          onToggleFavorite(item.id);
        }}
      >
        <StarIcon fill={favorite ? "currentColor" : "none"} />
      </Button>
    </CommandItem>
  );
}

function SearchResults({ indexUrl }: { indexUrl: string }) {
  const [items, setItems] = useState<SearchItem[]>();
  const [query, setQuery] = useState("");
  const { favorites, recents, toggleFavorite } = useLocalLists();

  useEffect(() => {
    void loadIndex(indexUrl).then(setItems);
  }, [indexUrl]);

  const byId = new Map(items?.map((item) => [item.id, item]));
  const pick = (ids: string[]) =>
    ids.flatMap((id) => {
      const item = byId.get(id);
      return item ? [item] : [];
    });
  // 在 Tool 页打开时，可以收藏或取消收藏当前 Tool
  const current = items?.find((item) => item.path === location.pathname);
  const currentFavorite = current && favorites.includes(current.id);
  const row = (item: SearchItem, group: string) => (
    <ToolRow
      key={`${group}:${item.path}`}
      item={item}
      group={group}
      favorite={favorites.includes(item.id)}
      onToggleFavorite={toggleFavorite}
    />
  );

  return (
    <Command>
      <CommandInput placeholder={m.search_placeholder()} value={query} onValueChange={setQuery} />
      <CommandList>
        {items ? (
          <>
            <CommandEmpty>{m.search_empty()}</CommandEmpty>
            {/* 收藏、最近使用和收藏操作只在没输入搜索词时显示 */}
            {!query && current && (
              <CommandGroup>
                <CommandItem
                  value="favorite-current"
                  data-favorite-toggle
                  onSelect={() => toggleFavorite(current.id)}
                >
                  {currentFavorite ? <StarOffIcon /> : <StarIcon />}
                  {currentFavorite
                    ? m.favorite_remove({ name: current.name })
                    : m.favorite_add({ name: current.name })}
                </CommandItem>
              </CommandGroup>
            )}
            {!query && favorites.length > 0 && (
              <CommandGroup heading={m.search_favorites()} data-group="favorites">
                {pick(favorites).map((item) => row(item, "favorite"))}
              </CommandGroup>
            )}
            {!query && recents.length > 0 && (
              <CommandGroup heading={m.search_recent()} data-group="recents">
                {pick(recents)
                  .slice(0, RECENTS_SHOWN)
                  .map((item) => row(item, "recent"))}
              </CommandGroup>
            )}
            <CommandGroup heading={query ? undefined : m.search_all()}>
              {items.map((item) => row(item, "tool"))}
            </CommandGroup>
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
