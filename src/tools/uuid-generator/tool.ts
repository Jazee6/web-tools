import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

const uuid = "[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";

export default defineTool({
  id: "uuid-generator",
  category: "developer",
  input: v.object({
    count: v.optional(
      v.pipe(
        v.number(),
        v.integer(),
        v.minValue(1),
        v.maxValue(1000),
        v.description("Number of UUIDs to generate, from 1 to 1,000"),
      ),
      1,
    ),
    uppercase: v.optional(
      v.pipe(v.boolean(), v.description("Use uppercase hexadecimal letters")),
      false,
    ),
  }),
  output: v.object({
    uuids: v.pipe(
      v.string(),
      v.description("Random UUID v4 identifiers, one per line"),
      v.metadata<string, FieldMetadata>({ widget: "code" }),
    ),
  }),
  examples: [
    { input: {}, output: { uuids: { pattern: uuid } } },
    { input: { count: 3 }, output: { uuids: { pattern: `${uuid}(?:\\n${uuid}){2}` } } },
    {
      input: { count: 2, uppercase: true },
      output: { uuids: { pattern: `${uuid.toUpperCase()}(?:\\n${uuid.toUpperCase()}){1}` } },
    },
  ],
  runtime: { where: "client" },
  agent: {
    webmcp: true,
    remote: false,
    description:
      "Generate 1 to 1,000 cryptographically random UUID v4 identifiers, one per line. Defaults to one lowercase UUID; optionally use uppercase. Does not generate UUID v1, v5 or v7.",
  },
  run: () => import("./core").then((m) => m.generateUuids),
});
