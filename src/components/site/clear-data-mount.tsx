import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { clearLocalData } from "@/lib/runtime/local-store";
import { m } from "@/paraglide/messages";

let open: (() => void) | undefined;

// "清除本地数据"的二次确认（architecture §13）。清除后重新加载页面，Service Worker 会重新安装
function ClearDataDialog() {
  const [visible, setVisible] = useState(true);
  const [clearing, setClearing] = useState(false);
  useEffect(() => {
    open = () => setVisible(true);
  }, []);

  const clear = async () => {
    setClearing(true);
    await clearLocalData().catch((error: unknown) => console.error(error));
    location.reload();
  };

  return (
    <AlertDialog open={visible} onOpenChange={(next) => !clearing && setVisible(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{m.clear_title()}</AlertDialogTitle>
          <AlertDialogDescription>{m.clear_description()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={clearing}>{m.tool_cancel()}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={clearing} onClick={() => void clear()}>
            {clearing && <Spinner />}
            {m.clear_confirm()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// 第一次调用时挂载并打开对话框，之后重新打开
export const openClearData = () => {
  if (open) return open();
  const container = document.createElement("div");
  document.body.append(container);
  createRoot(container).render(<ClearDataDialog />);
};
