import * as v from "valibot";

import { defineTool, type FieldMetadata } from "@/lib/tool-contract/define-tool";

const code = v.metadata<string, FieldMetadata>({ widget: "code" });

export default defineTool({
  id: "jwt-decoder",
  category: "developer",
  input: v.object({
    token: v.pipe(
      v.string(),
      v.nonEmpty(),
      v.description("The JSON Web Token to decode: three base64url parts separated by dots"),
      code,
    ),
  }),
  output: v.object({
    header: v.pipe(v.string(), v.description("The decoded JOSE header as formatted JSON"), code),
    payload: v.pipe(v.string(), v.description("The decoded claims as formatted JSON"), code),
    signature: v.pipe(
      v.string(),
      v.description("The signature part as it appears in the token (not verified)"),
      code,
    ),
    times: v.pipe(
      v.array(v.object({ claim: v.string(), time: v.string() })),
      v.description("The iat, nbf and exp claims converted to UTC time"),
    ),
  }),
  examples: [
    {
      input: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      },
      output: {
        header: '{\n  "alg": "HS256",\n  "typ": "JWT"\n}',
        payload: '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}',
        signature: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        times: [{ claim: "iat", time: "2018-01-18T01:30:22Z" }],
      },
    },
    {
      input: {
        token:
          "Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1LTQyIiwibmFtZSI6Ilpvw6siLCJuYmYiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAwMzYwMH0.",
      },
      output: {
        header: '{\n  "alg": "none",\n  "typ": "JWT"\n}',
        payload:
          '{\n  "sub": "u-42",\n  "name": "Zoë",\n  "nbf": 1700000000,\n  "exp": 1700003600\n}',
        signature: "",
        times: [
          { claim: "nbf", time: "2023-11-14T22:13:20Z" },
          { claim: "exp", time: "2023-11-14T23:13:20Z" },
        ],
      },
    },
  ],
  runtime: { where: "client" },
  agent: {
    webmcp: true,
    remote: true,
    description:
      "Decode a JSON Web Token (JWS) into its header, payload and signature, and convert the iat, nbf and exp claims to UTC times. It only decodes: the signature is never verified, so the result must not be trusted as proof of who issued the token. Accepts an optional Bearer prefix and unsigned tokens with an empty signature. Fails with error code invalid_token when the token is not three base64url parts, invalid_json when the header or payload is not a JSON object, and encrypted_token for five-part encrypted tokens (JWE).",
  },
  run: () => import("./core").then((m) => m.decodeJwt),
});
