function getDateForList(date) {
    var d = new Date(date);
    var dt = "";
    dt += $L('weekday_' + d.getDay()) + ", ";
    dt += d.getDate() + " " + $L('monthsLong_' + d.getMonth());
    if (d.getYear() < (new Date).getYear())
        dt += " " + d.getFullYear();
    return dt;
}

function getDateForDetails(date) {
    var d = new Date(date);
    var dt = "";
    dt += d.getDate() + " ";
    dt += $L('monthsLong_' + d.getMonth()) + " ";
    dt += d.getYear() + " ";
    return dt;
}