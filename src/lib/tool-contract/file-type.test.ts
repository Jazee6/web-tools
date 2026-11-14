import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { fileType } from "./file-type";

const schema = v.pipe(
  v.file(),
  fileType({ "video/mp4": [".mp4", ".m4v"], "video/x-matroska": [".mkv"] }),
  v.maxSize(10),
);

describe("fileType", () => {
  it("accepts files whose MIME type is listed", () => {
    const file = new File(["x"], "clip.bin", { type: "video/mp4" });
    expect(v.parse(schema, file)).toBe(file);
  });

  it("falls back to the extension and sets the listed MIME type", () => {
    // Firefox / Safari 不认识 .mkv，Chrome 报 video/matroska
    for (const type of ["", "video/matroska"]) {
      const output = v.parse(schema, new File(["x"], "Clip.MKV", { type, lastModified: 1 }));
      expect(output).toMatchObject({ name: "Clip.MKV", type: "video/x-matroska", lastModified: 1 });
    }
  });

  it("rejects files matching neither the MIME type nor the extension", () => {
    const result = v.safeParse(schema, new File(["x"], "notes.txt", { type: "text/plain" }));
    expect(result.issues?.[0]).toMatchObject({ type: "file_type", received: '"text/plain"' });
    const unnamed = v.safeParse(schema, new File(["x"], "mkv", { type: "" }));
    expect(unnamed.issues?.[0]).toMatchObject({ type: "file_type", received: '""' });
  });

  it("stops before later checks when the type is wrong", () => {
    const result = v.safeParse(
      schema,
      new File(["more than ten bytes"], "a.txt", { type: "text/plain" }),
    );
    expect(result.issues?.map((issue) => issue.type)).toEqual(["file_type"]);
  });
});
