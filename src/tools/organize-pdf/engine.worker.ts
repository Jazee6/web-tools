import { renderThumbnails } from "@/lib/pdf/thumbnails";
import { exposeRun } from "@/lib/runtime/rpc";

import { organizePdf } from "./core";

exposeRun(organizePdf, { preview: renderThumbnails });
