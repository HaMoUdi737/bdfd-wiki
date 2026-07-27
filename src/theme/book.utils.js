"use strict";

var DARK_THEMES = [
    "coal",
    "navy",
    "bdfd",
    "green",
    "ios",
    "shiro",
    "gluo",
    "kneon",
    "terminal",
    "highcon",
    "discord",
];

function getThemeStylesheetConfig(theme) {
    if (DARK_THEMES.indexOf(theme) !== -1) {
        return {
            ayuHighlight: true,
            tomorrowNight: false,
            highlight: true,
            aceTheme: "ace/theme/tomorrow_night",
        };
    } else if (theme === "ayu") {
        return {
            ayuHighlight: false,
            tomorrowNight: true,
            highlight: true,
            aceTheme: "ace/theme/tomorrow_night",
        };
    } else {
        return {
            ayuHighlight: true,
            tomorrowNight: true,
            highlight: false,
            aceTheme: "ace/theme/dawn",
        };
    }
}

function isBDFDTheme(theme) {
    return theme === "bdfd";
}

function resolveTheme(storedTheme, defaultTheme) {
    if (storedTheme === null || storedTheme === undefined) {
        return defaultTheme;
    }
    return storedTheme;
}

function shouldFoldMenu(menuFolded, currentScroll, previousScroll) {
    if (menuFolded && currentScroll < previousScroll) {
        return false;
    } else if (!menuFolded && currentScroll > previousScroll) {
        return true;
    }
    return menuFolded;
}

function shouldBorderMenu(currentScroll) {
    return currentScroll > 0;
}

function isSwipeGesture(xDiff, tDiff) {
    return tDiff < 250 && Math.abs(xDiff) >= 150;
}

function getSwipeDirection(xDiff, startX, curX, bodyWidth) {
    if (xDiff >= 0 && startX < Math.min(bodyWidth * 0.25, 300)) {
        return "show";
    } else if (xDiff < 0 && curX < 300) {
        return "hide";
    }
    return null;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        DARK_THEMES: DARK_THEMES,
        getThemeStylesheetConfig: getThemeStylesheetConfig,
        isBDFDTheme: isBDFDTheme,
        resolveTheme: resolveTheme,
        shouldFoldMenu: shouldFoldMenu,
        shouldBorderMenu: shouldBorderMenu,
        isSwipeGesture: isSwipeGesture,
        getSwipeDirection: getSwipeDirection,
    };
}
