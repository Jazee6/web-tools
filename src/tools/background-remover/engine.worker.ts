import { exposeRun } from "@/lib/runtime/rpc";

import { removeBackground } from "./core";

exposeRun((input: Parameters<typeof removeBackground>[0], ctx) => removeBackground(input, ctx));
