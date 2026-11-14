import { exposeRun } from "@/lib/runtime/rpc";

import { imageToText } from "./core";

exposeRun((input: Parameters<typeof imageToText>[0], ctx) => imageToText(input, ctx));
