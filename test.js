'use strict';

var record = {
    "id": "3",
    "start_date": "2018-8-9",
    "end_date": "2018-12-28",
    "rent": 510,
    "frequency": "fortnightly",
    "payment_day": "tuesday"
};

var arr = [1, 1, 1];

var day = {
    "monday": 0,
    "tuesday": 1,
    "wednesday": 2,
    "thursday": 3,
    "friday": 4,
    "saturday": 5,
    "sunday": 6
};

function recordList(record) {
    var recordlist = [];
    var startdate = parseDate(record.start_date);
    var enddate = parseDate(record.end_date);
    Object.freeze(day);
    Object.freeze(record);

    for (var i = new Date(startdate); i <= enddate; i.setDate(i.getDate() + 1)) {
        if (i.getDay() == day[record.payment_day]) {

            recordlist.push([startdate, new Date(i)]);
            i.setDate(i.getDate() + 1);
            startdate = new Date(i);
            //s1 = i.toDateString();
            if (record.frequency === "fortnightly") {
                i.setDate(i.getDate() + 12);
            } else if (record.frequency === "weekly") {
                i.setDate(i.getDate() + 6);
            } else if (record.frequency === "monthly") {
                i.setMonth(i.getMonth() + 1);
            }
        }
    }

    if (startdate < enddate) recordlist.push([startdate, enddate]);

    for (var _i = 0; _i < recordlist.length; _i++) {
        var days = daysBetween(recordlist[_i][0], recordlist[_i][1]) + 1;
        recordlist[_i].push(days, record.rent / 7 * days);
    }
    return recordlist;
}

function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

function daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}

function parseDate(input) {
    var parts = input.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]); // Note: months are 0-based
}
//this is a test
fetch('https://hiring-task-api.herokuapp.com/v1/leases/12').then(function (response) {
    return response.json();
}).then(function (myJson) {
    var table = recordList(myJson).map(function (item) {
        return React.createElement(
            "tr",
            null,
            React.createElement(
                "td",
                null,
                item[0].toDateString()
            ),
            React.createElement(
                "td",
                null,
                item[1].toDateString()
            ),
            React.createElement(
                "td",
                null,
                item[2]
            ),
            React.createElement(
                "td",
                null,
                Math.round(item[3], 2)
            )
        );
    });

    ReactDOM.render(React.createElement(
        "table",
        null,
        React.createElement(
            "thead",
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    "From"
                ),
                React.createElement(
                    "th",
                    null,
                    "To"
                ),
                React.createElement(
                    "th",
                    null,
                    "Days"
                ),
                React.createElement(
                    "th",
                    null,
                    "Amount($)"
                )
            )
        ),
        React.createElement(
            "tbody",
            null,
            "          ",
            table
        )
    ), document.getElementById('root'));
});