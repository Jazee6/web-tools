import { exposeRun } from "@/lib/runtime/rpc";

import { generateQrCode } from "./core";

exposeRun((input: Parameters<typeof generateQrCode>[0]) => generateQrCode(input));
