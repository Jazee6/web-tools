import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import type { ProgressStage } from "@/lib/tool-contract/define-tool";
import { m } from "@/paraglide/messages";

// Worker Tool 回报进度后才加载（不进首屏）；ratio 是 0–1
export default function RunProgress({ ratio, stage }: { ratio: number; stage?: ProgressStage }) {
  return (
    <Progress value={Math.round(ratio * 100)} data-progress data-stage={stage}>
      <ProgressLabel>
        {stage === "download" ? m.tool_progress_download() : m.tool_progress()}
      </ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}
