document.addEventListener("DOMContentLoaded", function() {
    var now = new Date();

    var timeMarkers = [
        { id: 'day-mark',    label: 'Current Day',       value: now.getDate() },
        { id: 'unix-mark',   label: 'Current Unix-time', value: now.getTime() },
        { id: 'second-mark', label: 'Current Second',    value: now.getSeconds() },
        { id: 'minute-mark', label: 'Current Minute',    value: now.getMinutes() },
        { id: 'hour-mark',   label: 'Current Hour',      value: now.getHours() }
    ];

    timeMarkers.forEach(function(marker) {
        var element = document.getElementById(marker.id);
        if (element) {
            element.innerHTML = marker.label + ": " + marker.value;
        }
    });
});
