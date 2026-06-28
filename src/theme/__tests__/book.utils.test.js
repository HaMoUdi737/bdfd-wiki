const {
    DARK_THEMES,
    getThemeStylesheetConfig,
    isBDFDTheme,
    resolveTheme,
    shouldFoldMenu,
    shouldBorderMenu,
    isSwipeGesture,
    getSwipeDirection,
} = require("../book.utils");

describe("DARK_THEMES", () => {
    it("contains coal", () => {
        expect(DARK_THEMES).toContain("coal");
    });

    it("contains navy", () => {
        expect(DARK_THEMES).toContain("navy");
    });

    it("contains bdfd", () => {
        expect(DARK_THEMES).toContain("bdfd");
    });

    it("does not contain ayu", () => {
        expect(DARK_THEMES).not.toContain("ayu");
    });

    it("does not contain light", () => {
        expect(DARK_THEMES).not.toContain("light");
    });

    it("has the expected number of dark themes", () => {
        expect(DARK_THEMES).toHaveLength(11);
    });
});

describe("getThemeStylesheetConfig", () => {
    it("returns tomorrow_night config for dark themes", () => {
        DARK_THEMES.forEach((theme) => {
            const config = getThemeStylesheetConfig(theme);
            expect(config.ayuHighlight).toBe(true);
            expect(config.tomorrowNight).toBe(false);
            expect(config.highlight).toBe(true);
            expect(config.aceTheme).toBe("ace/theme/tomorrow_night");
        });
    });

    it("returns ayu config for ayu theme", () => {
        const config = getThemeStylesheetConfig("ayu");
        expect(config.ayuHighlight).toBe(false);
        expect(config.tomorrowNight).toBe(true);
        expect(config.highlight).toBe(true);
        expect(config.aceTheme).toBe("ace/theme/tomorrow_night");
    });

    it("returns default (light) config for unknown themes", () => {
        const config = getThemeStylesheetConfig("light");
        expect(config.ayuHighlight).toBe(true);
        expect(config.tomorrowNight).toBe(true);
        expect(config.highlight).toBe(false);
        expect(config.aceTheme).toBe("ace/theme/dawn");
    });

    it("returns default (light) config for rust theme", () => {
        const config = getThemeStylesheetConfig("rust");
        expect(config.ayuHighlight).toBe(true);
        expect(config.tomorrowNight).toBe(true);
        expect(config.highlight).toBe(false);
        expect(config.aceTheme).toBe("ace/theme/dawn");
    });
});

describe("isBDFDTheme", () => {
    it("returns true for bdfd", () => {
        expect(isBDFDTheme("bdfd")).toBe(true);
    });

    it("returns false for other themes", () => {
        expect(isBDFDTheme("coal")).toBe(false);
        expect(isBDFDTheme("navy")).toBe(false);
        expect(isBDFDTheme("ayu")).toBe(false);
        expect(isBDFDTheme("light")).toBe(false);
    });

    it("returns false for empty string", () => {
        expect(isBDFDTheme("")).toBe(false);
    });
});

describe("resolveTheme", () => {
    it("returns stored theme when available", () => {
        expect(resolveTheme("coal", "bdfd")).toBe("coal");
    });

    it("returns default theme when stored is null", () => {
        expect(resolveTheme(null, "bdfd")).toBe("bdfd");
    });

    it("returns default theme when stored is undefined", () => {
        expect(resolveTheme(undefined, "bdfd")).toBe("bdfd");
    });

    it("returns stored theme even if it's an empty string", () => {
        expect(resolveTheme("", "bdfd")).toBe("");
    });
});

describe("shouldFoldMenu", () => {
    it("unfolds when folded and scrolling up", () => {
        expect(shouldFoldMenu(true, 50, 100)).toBe(false);
    });

    it("folds when unfolded and scrolling down", () => {
        expect(shouldFoldMenu(false, 100, 50)).toBe(true);
    });

    it("stays folded when folded and scrolling down", () => {
        expect(shouldFoldMenu(true, 100, 50)).toBe(true);
    });

    it("stays unfolded when unfolded and scrolling up", () => {
        expect(shouldFoldMenu(false, 50, 100)).toBe(false);
    });

    it("stays in current state when scroll position unchanged", () => {
        expect(shouldFoldMenu(true, 100, 100)).toBe(true);
        expect(shouldFoldMenu(false, 100, 100)).toBe(false);
    });
});

describe("shouldBorderMenu", () => {
    it("returns true when scrolled down", () => {
        expect(shouldBorderMenu(100)).toBe(true);
    });

    it("returns false when at top", () => {
        expect(shouldBorderMenu(0)).toBe(false);
    });

    it("returns true for small positive scroll", () => {
        expect(shouldBorderMenu(1)).toBe(true);
    });
});

describe("isSwipeGesture", () => {
    it("returns true for fast horizontal swipe", () => {
        expect(isSwipeGesture(200, 100)).toBe(true);
    });

    it("returns false for slow swipe", () => {
        expect(isSwipeGesture(200, 300)).toBe(false);
    });

    it("returns false for short distance", () => {
        expect(isSwipeGesture(50, 100)).toBe(false);
    });

    it("returns true for negative (left) fast swipe", () => {
        expect(isSwipeGesture(-200, 100)).toBe(true);
    });

    it("returns false at exactly 250ms boundary", () => {
        expect(isSwipeGesture(200, 250)).toBe(false);
    });

    it("returns false at exactly 150px boundary", () => {
        expect(isSwipeGesture(150, 100)).toBe(true);
    });

    it("returns false at 149px distance", () => {
        expect(isSwipeGesture(149, 100)).toBe(false);
    });
});

describe("getSwipeDirection", () => {
    it('returns "show" for right swipe starting from left edge', () => {
        expect(getSwipeDirection(200, 50, 250, 1000)).toBe("show");
    });

    it('returns "hide" for left swipe ending at left', () => {
        expect(getSwipeDirection(-200, 400, 200, 1000)).toBe("hide");
    });

    it("returns null for right swipe starting too far from left edge", () => {
        expect(getSwipeDirection(200, 400, 600, 1000)).toBeNull();
    });

    it("returns null for left swipe ending past 300px", () => {
        expect(getSwipeDirection(-200, 600, 400, 1000)).toBeNull();
    });

    it('uses 25% of body width as threshold for "show"', () => {
        expect(getSwipeDirection(200, 100, 300, 200)).toBeNull();
        expect(getSwipeDirection(200, 40, 240, 200)).toBe("show");
    });

    it("caps the left edge threshold at 300px", () => {
        expect(getSwipeDirection(200, 299, 499, 2000)).toBe("show");
        expect(getSwipeDirection(200, 301, 501, 2000)).toBeNull();
    });
});
