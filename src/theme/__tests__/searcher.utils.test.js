const {
    parseURL,
    renderURL,
    escapeHTML,
    formatSearchMetric,
    makeTeaser,
} = require("../searcher.utils");

describe("parseURL", () => {
    it("parses a simple URL with path and no query", () => {
        const result = parseURL("http://example.com/path/to/page.html");
        expect(result.protocol).toBe("http");
        expect(result.host).toBe("example.com");
        expect(result.port).toBe("");
        expect(result.path).toBe("/path/to/page.html");
        expect(result.file).toBe("page.html");
        expect(result.hash).toBe("");
        expect(result.params).toEqual({});
    });

    it("parses a URL with query parameters", () => {
        const result = parseURL("http://example.com/page?foo=bar&baz=qux");
        expect(result.params).toEqual({ foo: "bar", baz: "qux" });
    });

    it("parses a URL with a hash fragment", () => {
        const result = parseURL("http://example.com/page#section");
        expect(result.hash).toBe("section");
    });

    it("parses a URL with a port", () => {
        const result = parseURL("http://example.com:8080/page");
        expect(result.port).toBe("8080");
    });

    it("parses a URL with all components", () => {
        const result = parseURL(
            "https://example.com:3000/path/file.html?q=test&page=1#heading"
        );
        expect(result.protocol).toBe("https");
        expect(result.host).toBe("example.com");
        expect(result.port).toBe("3000");
        expect(result.path).toBe("/path/file.html");
        expect(result.file).toBe("file.html");
        expect(result.params).toEqual({ q: "test", page: "1" });
        expect(result.hash).toBe("heading");
    });

    it("handles a URL with no path segments", () => {
        const result = parseURL("http://example.com/");
        expect(result.path).toBe("/");
        expect(result.file).toBe("");
    });

    it("preserves the original URL as source", () => {
        const url = "http://example.com/test";
        const result = parseURL(url);
        expect(result.source).toBe(url);
    });

    it("handles a URL with empty query string", () => {
        const result = parseURL("http://example.com/page?");
        expect(result.params).toEqual({});
    });

    it("handles a URL with a single query parameter", () => {
        const result = parseURL("http://example.com/page?key=value");
        expect(result.params).toEqual({ key: "value" });
    });
});

describe("renderURL", () => {
    it("renders a simple URL with no port, params, or hash", () => {
        const urlObj = {
            protocol: "http",
            host: "example.com",
            port: "",
            path: "/page",
            params: {},
            hash: "",
        };
        expect(renderURL(urlObj)).toBe("http://example.com/page");
    });

    it("renders a URL with a port", () => {
        const urlObj = {
            protocol: "http",
            host: "example.com",
            port: "8080",
            path: "/page",
            params: {},
            hash: "",
        };
        expect(renderURL(urlObj)).toBe("http://example.com:8080/page");
    });

    it("renders a URL with query parameters", () => {
        const urlObj = {
            protocol: "https",
            host: "example.com",
            port: "",
            path: "/search",
            params: { q: "test" },
            hash: "",
        };
        expect(renderURL(urlObj)).toBe("https://example.com/search?q=test");
    });

    it("renders a URL with multiple query parameters", () => {
        const urlObj = {
            protocol: "https",
            host: "example.com",
            port: "",
            path: "/search",
            params: { q: "test", page: "2" },
            hash: "",
        };
        expect(renderURL(urlObj)).toBe(
            "https://example.com/search?q=test&page=2"
        );
    });

    it("renders a URL with a hash", () => {
        const urlObj = {
            protocol: "https",
            host: "example.com",
            port: "",
            path: "/page",
            params: {},
            hash: "section",
        };
        expect(renderURL(urlObj)).toBe("https://example.com/page#section");
    });

    it("renders a URL with all components", () => {
        const urlObj = {
            protocol: "https",
            host: "example.com",
            port: "3000",
            path: "/page",
            params: { foo: "bar" },
            hash: "heading",
        };
        expect(renderURL(urlObj)).toBe(
            "https://example.com:3000/page?foo=bar#heading"
        );
    });

    it("is the inverse of parseURL for a full URL", () => {
        const original = "https://example.com:3000/path/file.html?q=test#heading";
        const parsed = parseURL(original);
        expect(renderURL(parsed)).toBe(original);
    });
});

describe("escapeHTML", () => {
    it("escapes ampersands", () => {
        expect(escapeHTML("foo & bar")).toBe("foo &amp; bar");
    });

    it("escapes less-than signs", () => {
        expect(escapeHTML("<div>")).toBe("&lt;div&gt;");
    });

    it("escapes greater-than signs", () => {
        expect(escapeHTML("a > b")).toBe("a &gt; b");
    });

    it("escapes double quotes", () => {
        expect(escapeHTML('say "hello"')).toBe("say &#34;hello&#34;");
    });

    it("escapes single quotes", () => {
        expect(escapeHTML("it's")).toBe("it&#39;s");
    });

    it("escapes all special characters together", () => {
        expect(escapeHTML(`<p class="x">'a' & "b"</p>`)).toBe(
            "&lt;p class=&#34;x&#34;&gt;&#39;a&#39; &amp; &#34;b&#34;&lt;/p&gt;"
        );
    });

    it("returns the same string when no special characters", () => {
        expect(escapeHTML("hello world")).toBe("hello world");
    });

    it("handles an empty string", () => {
        expect(escapeHTML("")).toBe("");
    });
});

describe("formatSearchMetric", () => {
    it("returns singular form for 1 result", () => {
        expect(formatSearchMetric(1, "test")).toBe("1 search result");
    });

    it("returns 'No search results' for 0", () => {
        expect(formatSearchMetric(0, "test")).toBe("No search results");
    });

    it("returns plural form for multiple results", () => {
        expect(formatSearchMetric(5, "test")).toBe("5 search results");
    });

    it("returns plural form for 2 results", () => {
        expect(formatSearchMetric(2, "query")).toBe("2 search results");
    });

    it("returns plural form for large numbers", () => {
        expect(formatSearchMetric(100, "query")).toBe("100 search results");
    });
});

describe("makeTeaser", () => {
    const identity = (w) => w;

    it("returns body when no words are present", () => {
        expect(makeTeaser("", ["test"], identity, 30)).toBe("");
    });

    it("wraps matching terms in <em> tags", () => {
        const result = makeTeaser(
            "hello world test example",
            ["test"],
            identity,
            30
        );
        expect(result).toContain("<em>");
        expect(result).toContain("test");
        expect(result).toContain("</em>");
    });

    it("handles body with no matching searchterms", () => {
        const result = makeTeaser(
            "hello world example",
            ["missing"],
            identity,
            30
        );
        expect(result).not.toContain("<em>");
        expect(result).toContain("hello");
    });

    it("works with multiple search terms", () => {
        const result = makeTeaser(
            "the quick brown fox jumps over the lazy dog",
            ["quick", "lazy"],
            identity,
            30
        );
        expect(result).toContain("<em>");
        expect(result).toContain("quick");
        expect(result).toContain("lazy");
    });

    it("handles a single-word body", () => {
        const result = makeTeaser("hello", ["hello"], identity, 30);
        expect(result).toContain("<em>");
        expect(result).toContain("hello");
        expect(result).toContain("</em>");
    });

    it("respects teaserWordCount for windowing", () => {
        const words = Array.from({ length: 50 }, (_, i) => "word" + i).join(" ");
        const result = makeTeaser(words, ["word49"], identity, 5);
        expect(result).toContain("<em>");
        expect(result).toContain("word49");
    });

    it("uses the stemmer function to match terms", () => {
        const simpleStemmer = (w) => w.replace(/ing$/, "");
        const result = makeTeaser(
            "the running and jumping fox",
            ["run"],
            simpleStemmer,
            30
        );
        expect(result).toContain("<em>");
        expect(result).toContain("running");
    });

    it("handles sentences separated by periods", () => {
        const result = makeTeaser(
            "first sentence. second sentence with target. third sentence",
            ["target"],
            identity,
            30
        );
        expect(result).toContain("<em>");
        expect(result).toContain("target");
    });
});
