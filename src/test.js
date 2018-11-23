'use strict';
let record =
{
    "id": "3",
    "start_date": "2018-8-9",
    "end_date": "2018-12-28",
    "rent": 510,
    "frequency": "fortnightly",
    "payment_day": "tuesday"
}

let arr = [1, 1, 1];

const day =
{
    "monday": 0,
    "tuesday": 1,
    "wednesday": 2,
    "thursday": 3,
    "friday": 4,
    "saturday": 5,
    "sunday": 6,
}

function recordList(record) {
    let recordlist = [];
    let startdate = parseDate(record.start_date);
    let enddate = parseDate(record.end_date);
    Object.freeze(day);
    Object.freeze(record);

    for (let i = new Date(startdate); i <= enddate; i.setDate(i.getDate() + 1)) {
        if (i.getDay() == day[record.payment_day]) {

            recordlist.push([startdate, new Date(i)]);
            i.setDate(i.getDate() + 1);
            startdate = new Date(i);
            //s1 = i.toDateString();
            if (record.frequency === "fortnightly") {
                i.setDate(i.getDate() + 12);
            }
            else if (record.frequency === "weekly") {
                i.setDate(i.getDate() + 6);
            }
            else if (record.frequency === "monthly") {
                i.setMonth(i.getMonth() + 1);
            }
        }
    }

    if (startdate < enddate)
        recordlist.push([startdate, enddate]);

    for (let i = 0; i < recordlist.length; i++) {
        let days = daysBetween(recordlist[i][0], recordlist[i][1]) + 1;
        recordlist[i].push(days, record.rent / 7 * days);
    }
    return recordlist;
}

function treatAsUTC(date) {
    let result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

function daysBetween(startDate, endDate) {
    let millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}


function parseDate(input) {
    var parts = input.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1] - 1, parts[2]); // Note: months are 0-based
}
//this is a test
fetch('https://hiring-task-api.herokuapp.com/v1/leases/12')
    .then(function (response) {
        return response.json();
    })
    .then(function (myJson) {
        let table = recordList(myJson).map((item) =>

            <tr><td>{item[0].toDateString()}</td>
                <td>{item[1].toDateString()}</td>
                <td>{item[2]}</td>
                <td>{Math.round(item[3], 2)}</td></tr>);

        ReactDOM.render(
            <table>
                <thead>
                    <tr><th>From</th><th>To</th><th>Days</th><th>Amount($)</th>
                    </tr></thead><tbody>          {table}</tbody></table>,
            document.getElementById('root')
        );
    });
