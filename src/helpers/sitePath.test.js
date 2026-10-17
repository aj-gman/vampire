import { describe, expect, it } from "vitest";

const { normalizeBasePath, withBasePath, withoutBasePath } = require("./sitePath");
const { getFileTree } = require("./filetreeUtils");

describe("site path helpers", () => {
  it("normalizes a project base path", () => {
    expect(normalizeBasePath("/vampire/")).toBe("/vampire");
    expect(normalizeBasePath("")).toBe("");
  });

  it("prefixes site paths without changing their route", () => {
    expect(withBasePath("/notes/example/", "/vampire/")).toBe("/vampire/notes/example/");
    expect(withBasePath("/", "/vampire/")).toBe("/vampire/");
  });

  it("does not double-prefix or rewrite external URLs", () => {
    expect(withBasePath("/vampire/searchIndex.json", "/vampire/")).toBe("/vampire/searchIndex.json");
    expect(withBasePath("https://example.com/page", "/vampire/")).toBe("https://example.com/page");
    expect(withBasePath("#section", "/vampire/")).toBe("#section");
  });

  it("removes a base path before Eleventy rewrites HTML links", () => {
    expect(withoutBasePath("/vampire/notes/example/", "/vampire/")).toBe("/notes/example/");
    expect(withoutBasePath("/vampire/", "/vampire/")).toBe("/");
  });

  it("keeps file-tree note links rooted for Eleventy to prefix", () => {
    const tree = getFileTree({
      collections: {
        note: [{ filePathStem: "/notes/example", data: { permalink: "/example/" } }],
      },
    });

    expect(tree["example.md"].permalink).toBe("/example/");
  });
});