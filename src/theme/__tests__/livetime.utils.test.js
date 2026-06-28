const {
    buildTimeData,
    formatTimeLabel,
    ELEMENT_IDS,
} = require("../livetime.utils");

describe("buildTimeData", () => {
    it("extracts day from a Date object", () => {
        const date = new Date(2024, 0, 15, 10, 30, 45);
        const data = buildTimeData(date);
        expect(data.day).toBe(15);
    });

    it("extracts unix timestamp", () => {
        const date = new Date(2024, 0, 15, 10, 30, 45);
        const data = buildTimeData(date);
        expect(data.unix).toBe(date.getTime());
    });

    it("extracts seconds", () => {
        const date = new Date(2024, 0, 15, 10, 30, 45);
        const data = buildTimeData(date);
        expect(data.second).toBe(45);
    });

    it("extracts minutes", () => {
        const date = new Date(2024, 0, 15, 10, 30, 45);
        const data = buildTimeData(date);
        expect(data.minute).toBe(30);
    });

    it("extracts hours", () => {
        const date = new Date(2024, 0, 15, 10, 30, 45);
        const data = buildTimeData(date);
        expect(data.hour).toBe(10);
    });

    it("handles midnight correctly", () => {
        const date = new Date(2024, 0, 1, 0, 0, 0);
        const data = buildTimeData(date);
        expect(data.hour).toBe(0);
        expect(data.minute).toBe(0);
        expect(data.second).toBe(0);
        expect(data.day).toBe(1);
    });

    it("handles end of day correctly", () => {
        const date = new Date(2024, 0, 31, 23, 59, 59);
        const data = buildTimeData(date);
        expect(data.hour).toBe(23);
        expect(data.minute).toBe(59);
        expect(data.second).toBe(59);
        expect(data.day).toBe(31);
    });

    it("returns all expected keys", () => {
        const date = new Date();
        const data = buildTimeData(date);
        expect(Object.keys(data).sort()).toEqual(
            ["day", "hour", "minute", "second", "unix"].sort()
        );
    });
});

describe("formatTimeLabel", () => {
    it('formats day label', () => {
        expect(formatTimeLabel("day", 15)).toBe("Current Day: 15");
    });

    it('formats unix label', () => {
        expect(formatTimeLabel("unix", 1705312245000)).toBe(
            "Current Unix-time: 1705312245000"
        );
    });

    it('formats second label', () => {
        expect(formatTimeLabel("second", 45)).toBe("Current Second: 45");
    });

    it('formats minute label', () => {
        expect(formatTimeLabel("minute", 30)).toBe("Current Minute: 30");
    });

    it('formats hour label', () => {
        expect(formatTimeLabel("hour", 10)).toBe("Current Hour: 10");
    });

    it('returns just the value for unknown keys', () => {
        expect(formatTimeLabel("unknown", 42)).toBe("42");
    });

    it("handles zero values", () => {
        expect(formatTimeLabel("hour", 0)).toBe("Current Hour: 0");
    });
});

describe("ELEMENT_IDS", () => {
    it("maps day to day-mark", () => {
        expect(ELEMENT_IDS.day).toBe("day-mark");
    });

    it("maps unix to unix-mark", () => {
        expect(ELEMENT_IDS.unix).toBe("unix-mark");
    });

    it("maps second to second-mark", () => {
        expect(ELEMENT_IDS.second).toBe("second-mark");
    });

    it("maps minute to minute-mark", () => {
        expect(ELEMENT_IDS.minute).toBe("minute-mark");
    });

    it("maps hour to hour-mark", () => {
        expect(ELEMENT_IDS.hour).toBe("hour-mark");
    });

    it("has exactly 5 entries", () => {
        expect(Object.keys(ELEMENT_IDS)).toHaveLength(5);
    });
});
