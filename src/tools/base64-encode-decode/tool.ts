import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

const code = v.metadata<string, FieldMetadata>({ widget: "code" });

export default defineTool({
  id: "base64-encode-decode",
  category: "developer",
  input: v.object({
    text: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.description("The text to encode, or the Base64 string to decode"),
      code,
    ),
    mode: v.optional(
      v.pipe(v.picklist(["encode", "decode"]), v.description("Encode text or decode Base64")),
      "encode",
    ),
    urlSafe: v.optional(
      v.pipe(
        v.boolean(),
        v.description(
          "When encoding, use the URL-safe alphabet (- and _) and omit the = padding. Decoding accepts both alphabets either way",
        ),
      ),
      false,
    ),
  }),
  output: v.object({
    result: v.pipe(
      v.string(),
      v.description("The encoded Base64 string or the decoded text"),
      code,
    ),
  }),
  examples: [
    {
      input: { text: "Hello, 世界!" },
      output: { result: "SGVsbG8sIOS4lueVjCE=" },
    },
    {
      input: { text: "SGVsbG8sIOS4lueVjCE=", mode: "decode" },
      output: { result: "Hello, 世界!" },
    },
    {
      input: { text: "subjects?_d", urlSafe: true },
      output: { result: "c3ViamVjdHM_X2Q" },
    },
  ],
  runtime: { where: "client" },
  agent: {
    webmcp: true,
    remote: true,
    description:
      "Encode UTF-8 text to Base64, or decode Base64 back to text. Encoding can use the URL-safe alphabet without padding; decoding accepts both alphabets, ignores whitespace and tolerates missing padding. Fails with error code invalid_base64 when the input is not valid Base64, and invalid_utf8 when the decoded bytes are not valid UTF-8 text.",
  },
  run: () => import("./core").then((m) => m.convertBase64),
});
