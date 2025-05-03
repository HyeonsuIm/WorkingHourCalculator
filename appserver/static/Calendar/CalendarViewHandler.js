let displayDateYear = 2022;
let displayDateMonth = 1;
let displayDateDay = 1;
function displayModal(element) {
    var keyVal = element.getAttribute('data-id');
    let year_month_day = keyVal.split('-');
    $(".modal-body #keyVal").val(keyVal);
    const date = new Date(year_month_day[0], Number(year_month_day[1]) - 1, year_month_day[2]);
    let is_woring_day = false;
    if (IsCommonWorkingDay(year_month_day[0], year_month_day[1], year_month_day[2], date.getDay()))
        is_woring_day = true;
    let working_day_elements = document.getElementsByClassName('only_working_day');
    for (let index = 0; index < working_day_elements.length; index++) {
        let htmlElement = working_day_elements[index];
        if (is_woring_day)
            htmlElement.style.display = "";
        else
            htmlElement.style.display = "none";
    }
    let holiday_elements = document.getElementsByClassName('only_holiday');
    for (let index = 0; index < holiday_elements.length; index++) {
        let htmlElement = holiday_elements[index];
        if (is_woring_day)
            htmlElement.style.display = "none";
        else
            htmlElement.style.display = "";
    }
    if (is_woring_day) {
        let workingDayElement = document.getElementById('working_day');
        let fullDayElement = document.getElementById("full_day");
        let halfDayElement = document.getElementById("half_day");
        if (IsHalfVacation(year_month_day[0], year_month_day[1], year_month_day[2])) {
            halfDayElement.checked = true;
        }
        else if (IsVacation(year_month_day[0], year_month_day[1], year_month_day[2])) {
            fullDayElement.checked = true;
        }
        else {
            workingDayElement.checked = true;
        }
    }
    else {
        let holidayWorkingElement = document.getElementById("holiday_working_day");
        let holidayElement = document.getElementById('holiday');
        if (IsHolidayWorking(year_month_day[0], year_month_day[1], year_month_day[2])) {
            holidayWorkingElement.checked = true;
        }
        else {
            holidayElement.checked = true;
        }
    }
    let workingHours = GetWorkingHour();
    let working_hour_element = $("#work_hour_day");
    let day = Number(year_month_day[2]);
    if (workingHours[day]) {
        let str = String(Math.floor(workingHours[day] / 60)) + ":" + String(workingHours[day] % 60).padStart(2, '0');
        working_hour_element.val(str);
    }
    else {
        working_hour_element.val("");
        working_hour_element.attr('placeholder', '10:00');
    }
    $('#day_modal').modal('show');
}
function UpdateGlobalDateInformation() {
    var today = new Date();
    displayDateYear = today.getFullYear();
    displayDateMonth = today.getMonth();
    displayDateDay = today.getDate();
    UpdateLeaveWorkTime();
    restoreSelectBase();
    UpdateRemainWorkingHour();
    RequestHolidays(displayDateYear);
    RequestWorkingInfos(String(displayDateYear) + "-" + String(displayDateMonth + 1).padStart(2, "0"));
}
function UpdateAllViews() {
    let today = new Date();
    let isCurrentMonth = false;
    if (displayDateYear == today.getFullYear() && displayDateMonth == today.getMonth())
        isCurrentMonth = true;
    updateWorkingPlan();
    UpdateOvernightPayHour();
    updateWorkingOverpayPlan();
    render_calendar(displayDateYear, displayDateMonth, displayDateDay);
    render_working_hour(displayDateYear, displayDateMonth, displayDateDay);
    render_calculated_working_hour(displayDateYear, displayDateMonth, displayDateDay, isCurrentMonth);
    setElementVisibility(isCurrentMonth);
    renderOvernightPay();
}
function UpdateDayInformationFromPopup() {
    let keyValElement = document.getElementById("keyVal");
    let keyVal = keyValElement.value;
    let fullDayElement = document.getElementById("full_day");
    let halfDayElement = document.getElementById("half_day");
    let holidayElement = document.getElementById("holiday_working_day");
    if (fullDayElement.checked) {
        UpdateDayInfo(keyVal, 1);
    }
    else if (halfDayElement.checked) {
        UpdateDayInfo(keyVal, 2);
    }
    else if (holidayElement.checked) {
        UpdateDayInfo(keyVal, 3);
    }
    else {
        UpdateDayInfo(keyVal, 0);
    }
    let workingHourElement = document.getElementById('work_hour_day');
    let working_hour = workingHourElement.value;
    if (working_hour != '') {
        let timeStr = working_hour;
        let minute = 0;
        if (timeStr.includes(':')) {
            let times = timeStr.split(':');
            minute = parseInt(times[0]) * 60 + parseInt(times[1]);
        }
        else {
            minute = parseInt(timeStr) * 60;
        }
        let year_month_day = keyVal.split('-');
        let key = year_month_day[0] + "-" + year_month_day[1].padStart(2, "0");
        let working_hour_dict = {};
        working_hour_dict[key] = [[Number(year_month_day[2]), minute]];
        UpdateWorkingHours(working_hour_dict, key);
    }
}
function GetDisplayDate() {
    return [displayDateYear, displayDateMonth, displayDateDay];
}
function SetDisplayDate(year, month, day) {
    displayDateYear = year;
    displayDateMonth = month;
    displayDateDay = day;
}
