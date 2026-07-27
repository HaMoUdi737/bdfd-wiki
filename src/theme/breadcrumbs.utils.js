"use strict";

var BREADCRUMB_MAP = {
    bdscript: "Functions",
    guides: "Guides",
    resources: "Resources",
    callbacks: "Callbacks",
    premium: "Premium",
    javascript: "JavaScript",
};

function parsePath(pathname, nightlyAware) {
    nightlyAware = nightlyAware !== false;
    var root = "/bdfd-wiki/";
    var path = pathname.substring(11);
    var isNightly = false;

    if (nightlyAware && path.startsWith("nightly")) {
        path = path.substring(8);
        root += "nightly/";
        isNightly = true;
    }
    if (path.endsWith(".html")) {
        path = path.substring(0, path.length - 5);
    }

    return { root: root, path: path, isNightly: isNightly };
}

function buildBreadcrumbs(path, titleName) {
    var segments = path.split("/");
    var crumbs = [];

    segments.forEach(function (segment, i) {
        var name = BREADCRUMB_MAP[segment.toLowerCase()];
        var href;
        if (!name) {
            name = segments.length == i + 1 ? titleName : segment;
            href = segment !== "" ? segment + ".html" : segment;
        } else {
            href = "introduction.html";
        }
        crumbs.push({ name: name, href: href });
    });

    return crumbs;
}

function mapSegmentName(segment) {
    return BREADCRUMB_MAP[segment.toLowerCase()] || null;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        BREADCRUMB_MAP: BREADCRUMB_MAP,
        parsePath: parsePath,
        buildBreadcrumbs: buildBreadcrumbs,
        mapSegmentName: mapSegmentName,
    };
}
