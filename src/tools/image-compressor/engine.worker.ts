import { exposeRun } from "@/lib/runtime/rpc";

import { compressImages, estimateSizes } from "./core";

exposeRun(compressImages, estimateSizes);
