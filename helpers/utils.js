const moment = require('moment');

function setHour(date, hours) {
    let newDate = date;
    newDate.setHours(hours);
    newDate.setMinutes(0);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    return newDate;
}

// Returns a date with 8am time
exports.getMinTime = (date=moment().toDate()) => {
    let maxTime = setHour(date, 8);
    return moment(maxTime).utcOffset('+0800');
};

// Returns a date with 8pm time
exports.getMaxTime = (date=moment().toDate()) => {
    let maxTime = setHour(date, 20);
    return moment(maxTime).utcOffset('+0800');
}

// Returns 8pm of a date
exports.getMaxTime = (date=moment().toDate()) => {
    let maxTime = date;
    maxTime.setHours(20);
    maxTime.setMinutes(0);
    maxTime.setSeconds(0);
    maxTime.setMilliseconds(0);

    return moment(maxTime).utcOffset('+0800');
}

exports.getCurrentTime = () => 
                        moment().utcOffset('+0800');

exports.parseDate = (strDate, format='YYYY-MM-DDTHH:mm') => 
                        moment(strDate, format).utcOffset('+0800');