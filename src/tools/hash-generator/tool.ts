import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

const code = v.metadata<string, FieldMetadata>({ widget: "code" });

export default defineTool({
  id: "hash-generator",
  category: "developer",
  input: v.object({
    text: v.pipe(v.string(), v.nonEmpty(), v.description("The text to hash, read as UTF-8"), code),
    algorithm: v.optional(
      v.pipe(
        v.picklist(["md5", "sha-1", "sha-256", "sha-384", "sha-512"]),
        v.description("Hash algorithm. MD5 and SHA-1 are broken for security use; prefer SHA-256"),
      ),
      "sha-256",
    ),
    format: v.optional(
      v.pipe(
        v.picklist(["hex", "hex-upper", "base64"]),
        v.description("Output format: lowercase hex, uppercase hex or Base64"),
      ),
      "hex",
    ),
  }),
  output: v.object({
    hash: v.pipe(v.string(), v.description("The hash of the text"), code),
  }),
  examples: [
    {
      input: { text: "abc" },
      output: { hash: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad" },
    },
    {
      input: { text: "The quick brown fox jumps over the lazy dog", algorithm: "md5" },
      output: { hash: "9e107d9d372bb6826bd81d3542a419d6" },
    },
    {
      input: { text: "abc", algorithm: "sha-1", format: "base64" },
      output: { hash: "qZk+NkcGgWq6PiVxeFDCbJzQ2J0=" },
    },
  ],
  runtime: { where: "client" },
  agent: {
    webmcp: true,
    remote: true,
    description:
      "Compute the MD5, SHA-1, SHA-256, SHA-384 or SHA-512 hash of UTF-8 text and return it as lowercase hex, uppercase hex or Base64. Hashes text only, not files, and is not suitable for storing passwords.",
  },
  run: () => import("./core").then((m) => m.generateHash),
});
