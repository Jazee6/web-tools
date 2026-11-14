import { describe, expect, it } from "vitest";

import { convertCase, type CaseMode } from "./core";

const run = (text: string, mode: CaseMode) => convertCase({ text, mode }).result;

describe("convertCase upper and lower", () => {
  it("changes every letter, including non-English ones", () => {
    expect(run("straße Éclair", "upper")).toBe("STRASSE ÉCLAIR");
    expect(run("ÉCLAIR Привет", "lower")).toBe("éclair привет");
  });
});

describe("convertCase title", () => {
  it("capitalizes every word and lowercases the rest", () => {
    expect(run("hELLO wORLD", "title")).toBe("Hello World");
  });

  it("keeps apostrophes inside a word and capitalizes after hyphens", () => {
    expect(run("don't panic, well-known x2", "title")).toBe("Don't Panic, Well-Known X2");
  });

  it("leaves text without letters alone", () => {
    expect(run("1 + 2 = 3\n你好", "title")).toBe("1 + 2 = 3\n你好");
  });
});

describe("convertCase sentence", () => {
  it("capitalizes after . ! ? … and after line breaks, and lowercases the rest", () => {
    expect(run("THIS IS LOUD. and this is not! ok? yes… fine\nnew line", "sentence")).toBe(
      "This is loud. And this is not! Ok? Yes… Fine\nNew line",
    );
  });

  it("skips opening quotes and leading punctuation", () => {
    expect(run('"quoted start" he said. "another one"', "sentence")).toBe(
      '"Quoted start" he said. "Another one"',
    );
  });

  it("does not capitalize after a dot inside a number or a domain", () => {
    expect(run("pi is 3.14 and example.com is a domain.", "sentence")).toBe(
      "Pi is 3.14 and example.com is a domain.",
    );
  });

  it("capitalizes after full-width sentence ends", () => {
    expect(run("你好。hello！world", "sentence")).toBe("你好。Hello！World");
  });
});

describe("convertCase programming styles", () => {
  const input = "XMLHttpRequest and user_id-v2";

  it("splits on separators, case changes and acronym ends", () => {
    expect(run(input, "snake")).toBe("xml_http_request_and_user_id_v2");
    expect(run(input, "kebab")).toBe("xml-http-request-and-user-id-v2");
    expect(run(input, "constant")).toBe("XML_HTTP_REQUEST_AND_USER_ID_V2");
    expect(run(input, "camel")).toBe("xmlHttpRequestAndUserIdV2");
    expect(run(input, "pascal")).toBe("XmlHttpRequestAndUserIdV2");
  });

  it("keeps digits with the word before them and splits a leading number", () => {
    expect(run("utf8 encoder 2fa", "snake")).toBe("utf8_encoder_2_fa");
    expect(run("parseHTML", "snake")).toBe("parse_html");
  });

  it("converts each line separately and keeps line breaks", () => {
    expect(run("first line\r\nsecond-line\n\nthird_line", "camel")).toBe(
      "firstLine\r\nsecondLine\n\nthirdLine",
    );
  });

  it("handles non-Latin letters and drops punctuation", () => {
    expect(run("Привет мир!", "snake")).toBe("привет_мир");
    expect(run("你好 世界", "kebab")).toBe("你好-世界");
    expect(run("!!!", "snake")).toBe("");
  });

  it("treats a decomposed accent as part of its letter", () => {
    expect(run("café au lait", "snake")).toBe("café_au_lait");
  });
});
