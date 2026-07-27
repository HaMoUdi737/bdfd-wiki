"use strict";

function buildTimeData(date) {
    return {
        day: date.getDate(),
        unix: date.getTime(),
        second: date.getSeconds(),
        minute: date.getMinutes(),
        hour: date.getHours(),
    };
}

function formatTimeLabel(key, value) {
    var labels = {
        day: "Current Day: ",
        unix: "Current Unix-time: ",
        second: "Current Second: ",
        minute: "Current Minute: ",
        hour: "Current Hour: ",
    };
    return (labels[key] || "") + value;
}

var ELEMENT_IDS = {
    day: "day-mark",
    unix: "unix-mark",
    second: "second-mark",
    minute: "minute-mark",
    hour: "hour-mark",
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        buildTimeData: buildTimeData,
        formatTimeLabel: formatTimeLabel,
        ELEMENT_IDS: ELEMENT_IDS,
    };
}
