"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsCommonWorkingDay = exports.IsWorkingDay = exports.IsHolidayWorking = exports.IsHalfVacation = exports.IsVacation = exports.IsHoliday = void 0;
const DataStorageAPI = require("../Datas/DataStorageHandler");
function IsHoliday(year, month, date) {
    let dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(date).padStart(2, '0');
    if (-1 != DataStorageAPI.holidayList.indexOf(dateStr)) {
        return true;
    }
    else {
        return false;
    }
}
exports.IsHoliday = IsHoliday;
function IsVacation(year, month, date) {
    let dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(date).padStart(2, '0');
    if (-1 != DataStorageAPI.vacationList.indexOf(dateStr)) {
        return true;
    }
    else {
        return false;
    }
}
exports.IsVacation = IsVacation;
function IsHalfVacation(year, month, date) {
    let dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(date).padStart(2, '0');
    if (-1 != DataStorageAPI.half_vacationList.indexOf(dateStr)) {
        return true;
    }
    else {
        return false;
    }
}
exports.IsHalfVacation = IsHalfVacation;
function IsHolidayWorking(year, month, day) {
    let dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    if (-1 != DataStorageAPI.holidayWorkingList.indexOf(dateStr)) {
        return true;
    }
    else {
        return false;
    }
}
exports.IsHolidayWorking = IsHolidayWorking;
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
exports.IsWorkingDay = IsWorkingDay;
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
exports.IsCommonWorkingDay = IsCommonWorkingDay;
//# sourceMappingURL=CalendarAPI.js.map