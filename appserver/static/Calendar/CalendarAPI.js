function IsHoliday(year, month, date) {
    let dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(date).padStart(2, '0');
    if (-1 != holidayList.indexOf(dateStr)) {
        return true;
    }
    else {
        return false;
    }
}
function IsVacation(year, month, date) {
    let dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(date).padStart(2, '0');
    if (-1 != vacationList.indexOf(dateStr)) {
        return true;
    }
    else {
        return false;
    }
}
function IsHalfVacation(year, month, date) {
    let dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(date).padStart(2, '0');
    if (-1 != half_vacationList.indexOf(dateStr)) {
        return true;
    }
    else {
        return false;
    }
}
function IsHolidayWorking(year, month, day) {
    let dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    if (-1 != holidayWorkingList.indexOf(dateStr)) {
        return true;
    }
    else {
        return false;
    }
}
function IsWorkingDay(year, month, day, dayOfWeek) {
    if (IsHolidayWorking(year, month, day)) {
        return true;
    }
    else {
        if (false == IsHoliday(year, month, day) &&
            false == IsVacation(year, month, day) &&
            0 != dayOfWeek &&
            6 != dayOfWeek) {
            return true;
        }
        else {
            return false;
        }
    }
}
function IsCommonWorkingDay(year, month, day, dayOfWeek) {
    if (false == IsHoliday(year, month, day) &&
        0 != dayOfWeek &&
        6 != dayOfWeek) {
        return true;
    }
    else {
        return false;
    }
}
