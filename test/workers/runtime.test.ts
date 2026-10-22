import { describe, expect, it } from "vitest";

describe("workerd runtime", () => {
  it("runs tests inside the Workers runtime", () => {
    expect(navigator.userAgent).toBe("Cloudflare-Workers");
  });
});
