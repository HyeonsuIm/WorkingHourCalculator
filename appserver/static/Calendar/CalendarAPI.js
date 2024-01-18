function MakeWorkingHourMiniuteString(miniute) {
    if (miniute) {
        return Math.floor((miniute / 60)) + ":" + String(miniute % 60).padStart(2, '0');
    }
    else {
        return "";
    }
}
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
function GetWorkingDayVal(year, month, day, dayOfWeek) {
    if (IsHolidayWorking(year, month, day)) {
        return 1;
    }
    else {
        if (true == IsHoliday(year, month, day) ||
            true == IsVacation(year, month, day) ||
            0 == dayOfWeek ||
            6 == dayOfWeek) {
            return 0;
        }
        else if (true == IsHalfVacation(year, month, day)) {
            return 0.5;
        }
        else {
            return 1;
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
