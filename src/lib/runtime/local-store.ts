// 本地状态（architecture §13）：收藏、最近使用、每个 Tool 的偏好参数存在 IndexedDB，只在本设备，不上传。
// 自写的薄封装，不引入 idb。只在浏览器里按需加载（⌘K 对话框、Tool 表单水合后、页脚的"清除本地数据"）。
// IndexedDB 不可用（如部分隐私模式）时各函数 reject，调用方忽略即可，不影响 Tool 本身。

const DB_NAME = "web-tools";
const DB_VERSION = 1;

type StoreName = "favorites" | "recents" | "preferences";

const stores: StoreName[] = ["favorites", "recents", "preferences"];

// 最近使用只保留这么多条
export const MAX_RECENTS = 20;

export interface Favorite {
  id: string;
  addedAt: number;
}

export interface Recent {
  id: string;
  usedAt: number;
}

export type Preferences = Record<string, unknown>;

let opening: Promise<IDBDatabase> | undefined;

const openDb = (): Promise<IDBDatabase> =>
  (opening ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.addEventListener("upgradeneeded", () => {
      for (const name of stores) {
        if (!request.result.objectStoreNames.contains(name)) {
          request.result.createObjectStore(name, { keyPath: "id" });
        }
      }
    });
    request.addEventListener("success", () => {
      const db = request.result;
      // 其他标签页删除或升级数据库时让出连接，否则对方会一直被阻塞
      db.addEventListener("versionchange", () => {
        db.close();
        opening = undefined;
      });
      resolve(db);
    });
    request.addEventListener("error", () => {
      opening = undefined;
      reject(request.error);
    });
  }));

// 在一个事务里执行，事务提交后返回最后一个请求的结果
const transact = async <T>(
  name: StoreName,
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(name, mode);
    const request = run(transaction.objectStore(name));
    transaction.addEventListener("complete", () => resolve(request?.result as T));
    transaction.addEventListener("error", () => reject(transaction.error));
    transaction.addEventListener("abort", () => reject(transaction.error));
  });
};

const newestFirst = <T>(items: T[], key: (item: T) => number) =>
  items.toSorted((a, b) => key(b) - key(a));

export const listFavorites = async (): Promise<Favorite[]> =>
  newestFirst(
    await transact<Favorite[]>("favorites", "readonly", (store) => store.getAll()),
    (item) => item.addedAt,
  );

export const setFavorite = (id: string, favorite: boolean): Promise<void> =>
  transact<void>("favorites", "readwrite", (store) => {
    if (favorite) store.put({ id, addedAt: Date.now() } satisfies Favorite);
    else store.delete(id);
  });

export const listRecents = async (): Promise<Recent[]> =>
  newestFirst(
    await transact<Recent[]>("recents", "readonly", (store) => store.getAll()),
    (item) => item.usedAt,
  );

// 成功运行一次 Tool 后记录，超出 MAX_RECENTS 的旧记录删掉
export const recordUse = async (id: string): Promise<void> => {
  const stale = (await listRecents())
    .filter((item) => item.id !== id)
    .slice(MAX_RECENTS - 1)
    .map((item) => item.id);
  await transact<void>("recents", "readwrite", (store) => {
    store.put({ id, usedAt: Date.now() } satisfies Recent);
    for (const old of stale) store.delete(old);
  });
};

export const getPreferences = async (id: string): Promise<Preferences | undefined> =>
  (
    await transact<{ id: string; values: Preferences } | undefined>(
      "preferences",
      "readonly",
      (store) => store.get(id),
    )
  )?.values;

export const savePreferences = (id: string, values: Preferences): Promise<void> =>
  transact<void>("preferences", "readwrite", (store) => {
    store.put({ id, values });
  });

const deleteDb = () =>
  new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.addEventListener("success", () => resolve());
    request.addEventListener("error", () => reject(request.error));
  });

// "清除本地数据"：IndexedDB、OPFS、全部 Cache API 缓存（含模型和 Service Worker 的页面缓存），
// 并注销 Service Worker，下次打开页面时重新安装（连同离线页预缓存）
export const clearLocalData = async (): Promise<void> => {
  const db = await opening?.catch(() => undefined);
  db?.close();
  opening = undefined;
  await Promise.all([
    deleteDb(),
    caches?.keys().then((names) => Promise.all(names.map((name) => caches.delete(name)))),
    navigator.storage
      ?.getDirectory()
      .then(async (root) => {
        for await (const name of root.keys()) await root.removeEntry(name, { recursive: true });
      })
      .catch(() => {}),
    navigator.serviceWorker
      ?.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((item) => item.unregister()))),
  ]);
};
