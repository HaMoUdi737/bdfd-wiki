"use strict";

function parseURL(url) {
    var a = new URL(url, "http://localhost");
    return {
        source: url,
        protocol: a.protocol.replace(":", ""),
        host: a.hostname,
        port: a.port,
        params: (function () {
            var ret = {};
            var seg = a.search.replace(/^\?/, "").split("&");
            var len = seg.length,
                i = 0,
                s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split("=");
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^/?#]+)$/i) || [, ""])[1],
        hash: a.hash.replace("#", ""),
        path: a.pathname.replace(/^([^/])/, "/$1"),
    };
}

function renderURL(urlobject) {
    var url = urlobject.protocol + "://" + urlobject.host;
    if (urlobject.port != "") {
        url += ":" + urlobject.port;
    }
    url += urlobject.path;
    var joiner = "?";
    for (var prop in urlobject.params) {
        if (urlobject.params.hasOwnProperty(prop)) {
            url += joiner + prop + "=" + urlobject.params[prop];
            joiner = "&";
        }
    }
    if (urlobject.hash != "") {
        url += "#" + urlobject.hash;
    }
    return url;
}

var escapeHTML = (function () {
    var MAP = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&#34;",
        "'": "&#39;",
    };
    var repl = function (c) {
        return MAP[c];
    };
    return function (s) {
        return s.replace(/[&<>'"]/g, repl);
    };
})();

function formatSearchMetric(count, searchterm) {
    if (count == 1) {
        return count + " search result";
    } else if (count == 0) {
        return "No search results";
    } else {
        return count + " search results";
    }
}

function makeTeaser(body, searchterms, stemmer, teaserWordCount) {
    teaserWordCount = teaserWordCount || 30;

    var stemmed_searchterms = searchterms.map(function (w) {
        return stemmer(w.toLowerCase());
    });
    var searchterm_weight = 40;
    var weighted = [];
    var sentences = body.toLowerCase().split(". ");
    var index = 0;
    var value = 0;
    var searchterm_found = false;
    for (var sentenceindex in sentences) {
        var words = sentences[sentenceindex].split(" ");
        value = 8;
        for (var wordindex in words) {
            var word = words[wordindex];
            if (word.length > 0) {
                for (var searchtermindex in stemmed_searchterms) {
                    if (
                        stemmer(word).startsWith(
                            stemmed_searchterms[searchtermindex]
                        )
                    ) {
                        value = searchterm_weight;
                        searchterm_found = true;
                    }
                }
                weighted.push([word, value, index]);
                value = 2;
            }
            index += word.length;
            index += 1;
        }
        index += 1;
    }

    if (weighted.length == 0) {
        return body;
    }

    var window_weight = [];
    var window_size = Math.min(weighted.length, teaserWordCount);

    var cur_sum = 0;
    for (var wordindex = 0; wordindex < window_size; wordindex++) {
        cur_sum += weighted[wordindex][1];
    }
    window_weight.push(cur_sum);
    for (var wordindex = 0; wordindex < weighted.length - window_size; wordindex++) {
        cur_sum -= weighted[wordindex][1];
        cur_sum += weighted[wordindex + window_size][1];
        window_weight.push(cur_sum);
    }

    var max_sum_window_index = 0;
    if (searchterm_found) {
        var max_sum = 0;
        for (var i = window_weight.length - 1; i >= 0; i--) {
            if (window_weight[i] > max_sum) {
                max_sum = window_weight[i];
                max_sum_window_index = i;
            }
        }
    }

    var teaser_split = [];
    var index = weighted[max_sum_window_index][2];
    for (
        var i = max_sum_window_index;
        i < max_sum_window_index + window_size;
        i++
    ) {
        var word = weighted[i];
        if (index < word[2]) {
            teaser_split.push(body.substring(index, word[2]));
            index = word[2];
        }
        if (word[1] == searchterm_weight) {
            teaser_split.push("<em>");
        }
        index = word[2] + word[0].length;
        teaser_split.push(body.substring(word[2], index));
        if (word[1] == searchterm_weight) {
            teaser_split.push("</em>");
        }
    }

    return teaser_split.join("");
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        parseURL: parseURL,
        renderURL: renderURL,
        escapeHTML: escapeHTML,
        formatSearchMetric: formatSearchMetric,
        makeTeaser: makeTeaser,
    };
}
