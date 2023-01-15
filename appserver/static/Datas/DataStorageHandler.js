"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWorkingHour = exports.UpdateAllLocalStorage = exports.RequestWorkingInfos = exports.UpdateWorkingHours = exports.UpdateLocalWorkingHour = exports.UpdateVacations = exports.UpdateLocalVacation = exports.RequestHolidays = exports.holidayWorkingList = exports.half_vacationList = exports.vacationList = exports.holidayList = exports.working_hours = void 0;
const axios_1 = require("axios");
const CalendarView = require("../Calendar/CalendarViewHandler.js");
exports.working_hours = [];
exports.holidayList = [];
exports.vacationList = [];
exports.half_vacationList = [];
exports.holidayWorkingList = [];
var getCookie = function (name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? value[2] : null;
};
function RequestHolidays(year) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('/api/request/holidays', {
                params: {
                    year: year
                }
            });
            console.log(response);
            exports.holidayList = response.data['holidays'];
            CalendarView.UpdateAllViews();
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.RequestHolidays = RequestHolidays;
function UpdateLocalVacation(year_month_day, type) {
    let idx = exports.vacationList.indexOf(year_month_day);
    if (-1 != idx) {
        exports.vacationList.splice(idx, 1);
    }
    idx = exports.half_vacationList.indexOf(year_month_day);
    if (-1 != idx) {
        exports.half_vacationList.splice(idx, 1);
    }
    idx = exports.holidayWorkingList.indexOf(year_month_day);
    if (-1 != idx) {
        exports.holidayWorkingList.splice(idx, 1);
    }
    if (1 == type) {
        exports.vacationList.push(year_month_day);
    }
    else if (2 == type) {
        exports.half_vacationList.push(year_month_day);
    }
    else if (3 == type) {
        exports.holidayWorkingList.push(year_month_day);
    }
    CalendarView.UpdateAllViews();
}
exports.UpdateLocalVacation = UpdateLocalVacation;
function UpdateVacations(year_month_day, type) {
    return __awaiter(this, void 0, void 0, function* () {
        let member_id = getCookie('member_id');
        let [year, month, day] = year_month_day.split('-', 3);
        const key = String(year) + "-" + String(month).padStart(2, "0");
        if (member_id == null) {
            const vacationKey = "vacation:" + key;
            let dataStr = localStorage.getItem(vacationKey);
            let datas;
            if (null === dataStr) {
                datas = Array.from({ length: 32 }, () => 0);
            }
            else {
                datas = JSON.parse(dataStr);
            }
            datas[Number(day)] = type;
            localStorage.removeItem(vacationKey);
            localStorage.setItem(vacationKey, JSON.stringify(datas));
            UpdateLocalVacation(year_month_day, type);
        }
        else {
            try {
                const response = yield axios_1.default.post('/api/request/update_vacation', {}, {
                    params: {
                        year: year,
                        month: month,
                        day: day,
                        type: type
                    }
                });
                UpdateLocalVacation(year_month_day, type);
            }
            catch (error) {
                console.log(error);
            }
        }
    });
}
exports.UpdateVacations = UpdateVacations;
function UpdateLocalWorkingHour(working_hour_map, year_month) {
    if (year_month in working_hour_map) {
        for (let i = 0; i < working_hour_map[year_month].length; i++) {
            exports.working_hours[working_hour_map[year_month][i][0]] = working_hour_map[year_month][i][1];
        }
    }
    CalendarView.UpdateAllViews();
}
exports.UpdateLocalWorkingHour = UpdateLocalWorkingHour;
function UpdateWorkingHours(working_hour_map, year_month) {
    return __awaiter(this, void 0, void 0, function* () {
        let member_id = getCookie('member_id');
        if (member_id == null) {
            for (let key in working_hour_map) {
                const workingHourKey = "WorkingHour:" + key;
                let dataStr = localStorage.getItem(workingHourKey);
                let datas;
                if (null === dataStr) {
                    datas = Array.from({ length: 32 }, () => 0);
                }
                else {
                    datas = JSON.parse(dataStr);
                }
                for (let i = 0; i < working_hour_map[key].length; i++) {
                    datas[working_hour_map[key][i][0]] = working_hour_map[key][i][1];
                }
                localStorage.removeItem(workingHourKey);
                localStorage.setItem(workingHourKey, JSON.stringify(datas));
            }
            if (year_month != null) {
                UpdateLocalWorkingHour(working_hour_map, year_month);
            }
            else {
                location.href = '/';
            }
        }
        else {
            try {
                const response = yield axios_1.default.post('/api/request/set_working_hours', {}, {
                    params: {
                        map: JSON.stringify(working_hour_map)
                    }
                });
                if (year_month != null) {
                    UpdateLocalWorkingHour(working_hour_map, year_month);
                }
                else {
                    location.href = '/';
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    });
}
exports.UpdateWorkingHours = UpdateWorkingHours;
function RequestWorkingInfos(year_month) {
    return __awaiter(this, void 0, void 0, function* () {
        let member_id = getCookie('member_id');
        let [year, month] = year_month.split('-', 2);
        exports.vacationList = [];
        exports.half_vacationList = [];
        exports.holidayWorkingList = [];
        if (member_id == null) {
            const vacationKey = "vacation:" + year_month;
            let datas = localStorage.getItem(vacationKey);
            if (datas) {
                let work_types = JSON.parse(datas);
                for (let i = 0; i < 32; i++) {
                    let date = year_month + "-" + String(i).padStart(2, "0");
                    if (1 == work_types[i]) {
                        exports.vacationList.push(date);
                    }
                    else if (2 == work_types[i]) {
                        exports.half_vacationList.push(date);
                    }
                    else if (3 == work_types[i]) {
                        exports.holidayWorkingList.push(date);
                    }
                }
            }
            const workingHourKey = "WorkingHour:" + String(year) + "-" + String(month).padStart(2, '0');
            datas = localStorage.getItem(workingHourKey);
            if (null === datas) {
                exports.working_hours = Array.from({ length: 32 }, () => 0);
            }
            else {
                exports.working_hours = JSON.parse(datas);
            }
            CalendarView.UpdateAllViews();
        }
        else {
            try {
                const response = yield axios_1.default.post('/api/request/get_working_info', {}, {
                    params: {
                        year: year,
                        month: month,
                    }
                });
                if (response.data['working_days'].length) {
                    for (let i = 0; i < 32; i++) {
                        let date = String(year) + "-" + String(month).padStart(2, "0") + "-" + String(i).padStart(2, "0");
                        if (response.data['working_days'][i] == 1) {
                            exports.vacationList.push(date);
                        }
                        else if (response.data['working_days'][i] == 2) {
                            exports.half_vacationList.push(date);
                        }
                        else if (response.data['working_days'][i] == 3) {
                            exports.holidayWorkingList.push(date);
                        }
                    }
                }
                if (response.data['working_hours'].length) {
                    exports.working_hours = response.data['working_hours'];
                }
                else {
                    exports.working_hours = Array.from({ length: 32 }, () => 0);
                }
                CalendarView.UpdateAllViews();
            }
            catch (error) {
                console.log(error);
            }
        }
    });
}
exports.RequestWorkingInfos = RequestWorkingInfos;
function UpdateAllLocalStorage() {
    const oldKeyReg = /\d{4}-\d{2}-\d{2}/;
    let removeKeyList = [];
    for (let key in localStorage) {
        if (oldKeyReg.test(key)) {
            let vacationType = localStorage.getItem(key);
            UpdateVacations(key, Number(vacationType));
            removeKeyList.push(key);
        }
    }
    for (let index = 0; index < removeKeyList.length; index++) {
        localStorage.removeItem(removeKeyList[index]);
    }
}
exports.UpdateAllLocalStorage = UpdateAllLocalStorage;
function GetWorkingHour() {
    return exports.working_hours;
}
exports.GetWorkingHour = GetWorkingHour;
//# sourceMappingURL=DataStorageHandler.js.map