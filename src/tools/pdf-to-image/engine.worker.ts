import { exposeRun } from "@/lib/runtime/rpc";

import { pdfToImage } from "./core";

exposeRun(pdfToImage);
