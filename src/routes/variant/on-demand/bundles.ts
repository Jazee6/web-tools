import { env } from "cloudflare:workers";

import { assetBundleLoader } from "@/lib/variant-ssr";

// 每个 isolate 一份：内容包解析后留在内存里，同一部署的后续请求不再读 ASSETS
export const loadBundle = assetBundleLoader(env.ASSETS);
