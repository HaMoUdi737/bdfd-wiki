const {
    BREADCRUMB_MAP,
    parsePath,
    buildBreadcrumbs,
    mapSegmentName,
} = require("../breadcrumbs.utils");

describe("BREADCRUMB_MAP", () => {
    it("maps bdscript to Functions", () => {
        expect(BREADCRUMB_MAP.bdscript).toBe("Functions");
    });

    it("maps guides to Guides", () => {
        expect(BREADCRUMB_MAP.guides).toBe("Guides");
    });

    it("maps resources to Resources", () => {
        expect(BREADCRUMB_MAP.resources).toBe("Resources");
    });

    it("maps callbacks to Callbacks", () => {
        expect(BREADCRUMB_MAP.callbacks).toBe("Callbacks");
    });

    it("maps premium to Premium", () => {
        expect(BREADCRUMB_MAP.premium).toBe("Premium");
    });

    it("maps javascript to JavaScript", () => {
        expect(BREADCRUMB_MAP.javascript).toBe("JavaScript");
    });

    it("has exactly 6 entries", () => {
        expect(Object.keys(BREADCRUMB_MAP)).toHaveLength(6);
    });
});

describe("mapSegmentName", () => {
    it("returns the mapped name for a known segment", () => {
        expect(mapSegmentName("bdscript")).toBe("Functions");
    });

    it("is case-insensitive", () => {
        expect(mapSegmentName("BDScript")).toBe("Functions");
        expect(mapSegmentName("GUIDES")).toBe("Guides");
    });

    it("returns null for an unknown segment", () => {
        expect(mapSegmentName("unknown")).toBeNull();
    });

    it("returns null for an empty string", () => {
        expect(mapSegmentName("")).toBeNull();
    });
});

describe("parsePath", () => {
    it("strips /bdfd-wiki/ prefix from pathname", () => {
        const result = parsePath("/bdfd-wiki/bdscript/test.html");
        expect(result.root).toBe("/bdfd-wiki/");
        expect(result.path).toBe("bdscript/test");
        expect(result.isNightly).toBe(false);
    });

    it("detects nightly path", () => {
        const result = parsePath("/bdfd-wiki/nightly/bdscript/test.html");
        expect(result.root).toBe("/bdfd-wiki/nightly/");
        expect(result.path).toBe("bdscript/test");
        expect(result.isNightly).toBe(true);
    });

    it("strips .html extension", () => {
        const result = parsePath("/bdfd-wiki/page.html");
        expect(result.path).toBe("page");
    });

    it("handles path without .html extension", () => {
        const result = parsePath("/bdfd-wiki/page");
        expect(result.path).toBe("page");
    });

    it("handles root path", () => {
        const result = parsePath("/bdfd-wiki/");
        expect(result.path).toBe("");
    });

    it("can disable nightly detection", () => {
        const result = parsePath("/bdfd-wiki/nightly/page.html", false);
        expect(result.isNightly).toBe(false);
        expect(result.path).toBe("nightly/page");
    });
});

describe("buildBreadcrumbs", () => {
    it("maps known segments to their display names and uses introduction.html", () => {
        const crumbs = buildBreadcrumbs("bdscript/test", "Test Page");
        expect(crumbs[0]).toEqual({
            name: "Functions",
            href: "introduction.html",
        });
    });

    it("uses title name for the last unknown segment", () => {
        const crumbs = buildBreadcrumbs("bdscript/myFunc", "MyFunc");
        expect(crumbs[1]).toEqual({
            name: "MyFunc",
            href: "myFunc.html",
        });
    });

    it("uses segment name as-is for non-last unknown segments", () => {
        const crumbs = buildBreadcrumbs("custom/sub/page", "Page Title");
        expect(crumbs[0]).toEqual({
            name: "custom",
            href: "custom.html",
        });
        expect(crumbs[1]).toEqual({
            name: "sub",
            href: "sub.html",
        });
        expect(crumbs[2]).toEqual({
            name: "Page Title",
            href: "page.html",
        });
    });

    it("handles a single segment that is a known key", () => {
        const crumbs = buildBreadcrumbs("guides", "Guides Intro");
        expect(crumbs).toHaveLength(1);
        expect(crumbs[0]).toEqual({
            name: "Guides",
            href: "introduction.html",
        });
    });

    it("handles an empty path with a single empty segment", () => {
        const crumbs = buildBreadcrumbs("", "Home");
        expect(crumbs).toHaveLength(1);
        expect(crumbs[0]).toEqual({ name: "Home", href: "" });
    });

    it("handles deeply nested paths", () => {
        const crumbs = buildBreadcrumbs(
            "guides/general/interactions/buttons",
            "Buttons"
        );
        expect(crumbs).toHaveLength(4);
        expect(crumbs[0].name).toBe("Guides");
        expect(crumbs[0].href).toBe("introduction.html");
        expect(crumbs[3].name).toBe("Buttons");
    });

    it("handles multiple known segments in a row", () => {
        const crumbs = buildBreadcrumbs("premium/callbacks", "CB Page");
        expect(crumbs[0]).toEqual({
            name: "Premium",
            href: "introduction.html",
        });
        expect(crumbs[1]).toEqual({
            name: "Callbacks",
            href: "introduction.html",
        });
    });
});
