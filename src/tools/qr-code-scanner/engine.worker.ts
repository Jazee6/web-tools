import { exposeRun } from "@/lib/runtime/rpc";

import { scanCodes } from "./core";

exposeRun((input: Parameters<typeof scanCodes>[0]) => scanCodes(input));
