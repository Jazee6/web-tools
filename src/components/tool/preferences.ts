import {
  getDraft,
  getPreferences,
  recordUse,
  saveDraft,
  savePreferences,
} from "@/lib/runtime/local-store";

// 每个 Tool 的偏好参数（architecture §13 本地状态）。由 ToolForm 在水合后、成功运行后按需加载，不进首屏；
// 字段列表和校验由 ToolForm 传入，这里只依赖 local-store，避免把表单派生和 Valibot 拆成额外的首屏分块。

export interface RestoreTarget {
  // 记作偏好的字段（isPreferenceField）
  names: string[];
  // 字段还是初始值（用户没改过）时才恢复
  untouched: (name: string) => boolean;
  // 保存的值必须仍满足当前 schema
  accepts: (name: string, value: unknown) => boolean;
  set: (name: string, value: unknown) => void;
}

export const restorePreferences = async (
  toolId: string,
  target: RestoreTarget,
  active: () => boolean,
): Promise<void> => {
  if (target.names.length === 0) return;
  const saved = await getPreferences(toolId);
  if (!saved || !active()) return;
  for (const name of target.names) {
    const value = saved[name];
    if (value !== undefined && target.untouched(name) && target.accepts(name, value)) {
      target.set(name, value);
    }
  }
};

// 成功运行后记入最近使用，并保存这次的选项
export const rememberRun = async (
  toolId: string,
  names: string[],
  values: Record<string, unknown>,
): Promise<void> => {
  await Promise.all([
    recordUse(toolId),
    names.length > 0 &&
      savePreferences(toolId, Object.fromEntries(names.map((name) => [name, values[name]]))),
  ]);
};

// 草稿（契约里 draft: true 的文本字段）：水合后恢复到还是初始值的字段，编辑时由 ToolForm 防抖保存
export const restoreDrafts = async (
  toolId: string,
  target: Omit<RestoreTarget, "accepts">,
  active: () => boolean,
): Promise<void> => {
  for (const name of target.names) {
    const text = await getDraft(`${toolId}/${name}`);
    if (!active()) return;
    if (text && target.untouched(name)) target.set(name, text);
  }
};

export const saveDrafts = (toolId: string, values: Record<string, string>): Promise<unknown> =>
  Promise.all(Object.entries(values).map(([name, text]) => saveDraft(`${toolId}/${name}`, text)));
