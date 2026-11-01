// @tanstack/react-form 的 useForm 给每个表单都挂上 form.FormGroup，所以 FormGroupApi（约 2.7 KB gzip）摇不掉。
// 本站不用 FormGroup。astro.config.ts 把 react-form 里的 ./useFormGroup.js 指向这里，节省首屏 JS（architecture §15）。
// 升级后如果这个内部文件改了名，别名不再生效，体积回升会被 e2e/budget.spec.ts 发现。
const unsupported = (): never => {
  throw new Error("FormGroup is not bundled: see src/lib/stubs/tanstack-form-group.ts");
};

export const FormGroup = unsupported;
export const useFormGroup = unsupported;
