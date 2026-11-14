import { exposeRun } from "@/lib/runtime/rpc";

import { transcribe } from "./core";

exposeRun((input: Parameters<typeof transcribe>[0], ctx) => transcribe(input, ctx));
