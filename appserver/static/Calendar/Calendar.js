function get_calendar_header_elements(currentyear, currentMonth, totalWorkingHour, getPaid) {
    let elementStr = "<tr>\
        <td class='calendar_header'><button id='prev_button' class='btn btn-light' onclick='SetMonth(-1)'><</button></td>\
        <td class='calendar_header' id='year-month' colspan='6'>\
            <div style='position:relative;display:block;'>\
                " + currentyear + "." + (currentMonth) + "\
                <div style='line-height:15px;display:block;position:absolute;top:-5px;right:0px;bottom:auto'>";
    if (totalWorkingHour > 0) {
        elementStr += "<div style='float:left;text-align:left'><font size='2' color='#1c1c1c'>근무<br>야근</font></div>";
        elementStr += "<div style='float:right;text-align:left'><font size='2' color='#1c1c1c'>" + totalWorkingHour + "시간<br>" + getPaid + "만원</font></div>";
    }
    elementStr += "\
                </div>\
            </div>\
        </td>\
        <td class='calendar_header'><button id='next_button' class='btn btn-light' onclick='SetMonth(1)'>></button></td></tr>";
    // 요일 생성
    elementStr += "<tr>";
    //elementStr += "<td id='month-weekday'>CW</td>"
    elementStr += "<td class='sunday' id='month-weekday'>일</td>";
    elementStr += "<td id='month-weekday'>월</td>";
    elementStr += "<td id='month-weekday'>화</td>";
    elementStr += "<td id='month-weekday'>수</td>";
    elementStr += "<td id='month-weekday'>목</td>";
    elementStr += "<td id='month-weekday'>금</td>";
    elementStr += "<td class='saturday' id='month-weekday'>토</td>";
    elementStr += "<td class='month-weekday' id='month-weekday'>합계</td>";
    elementStr += "</tr>";
    return elementStr;
}
function get_calendar_content_elements(startDayOfWeek, lastDay, currentyear, currentMonth, day, workingHours) {
    // 앞쪽 빈칸
    let elementStr = "<tr>";
    //elementStr += "<td></td>"
    for (let i = 0; i < startDayOfWeek; i++) {
        elementStr += "<td id='month-day-empty'> </td>";
    }
    let displayDay = day;
    let dayOfWeek = 0;
    let weekWorkingHour = 0;
    //날짜 및 근무시간 생성
    for (let i = 1; i <= lastDay; i++) {
        dayOfWeek = (startDayOfWeek + i - 1) % 7;
        let classStr = "";
        let onclickStr = "";
        let otherAttr = "";
        let dataId = "";
        let isNeedPopup = true;
        if (true == IsHolidayWorking(currentyear, currentMonth, i)) {
            classStr = "class='working'";
        }
        else if (true == IsHoliday(currentyear, currentMonth, i)) {
            classStr = "class='holiday'";
        }
        else if (dayOfWeek == 6) {
            classStr = "class='saturday'";
        }
        else if (dayOfWeek == 0) {
            classStr = "class='sunday'";
        }
        else {
            if (true == IsVacation(currentyear, currentMonth, i)) {
                classStr = "class='vacation'";
            }
            else if (true == IsHalfVacation(currentyear, currentMonth, i)) {
                classStr = "class='half_vacation'";
            }
            else {
                classStr = "class='working'";
            }
        }
        if (true == isNeedPopup) {
            onclickStr = "onclick='displayModal(this)'";
            otherAttr = "data-toggle='modal' style='cursor:pointer;'";
            dataId += "data-id='" + currentyear + "-" + String(currentMonth).padStart(2, '0') + "-" + String(i).padStart(2, '0') + "'";
        }
        let idStr = "id=";
        if (displayDay == i) {
            idStr += "'month-day-today'";
        }
        else {
            idStr += "'month-day'";
        }
        weekWorkingHour += workingHours[i];
        elementStr += "<td " + idStr + " " + classStr + " " + onclickStr + " " + otherAttr + " " + dataId + " >" + i + "<br><h6>" + MakeWorkingHourMiniuteString(workingHours[i]) + "</h6></td>";
        if (dayOfWeek == 6) {
            elementStr += "<td><br><h6>" + MakeWorkingHourMiniuteString(weekWorkingHour) + "</h6></td>";
            elementStr += "</tr><tr>";
            //elementStr += "<td></td>"
            weekWorkingHour = 0;
        }
    }
    // 뒤쪽 빈칸이 있는 경우
    if (dayOfWeek < 6) {
        for (; dayOfWeek < 6; dayOfWeek++) {
            elementStr += "<td id='month-day-empty'></td>";
        }
        elementStr += "<td><br><h6>" + MakeWorkingHourMiniuteString(weekWorkingHour) + "</h6></td>";
    }
    elementStr += "</tr></table>";
    return elementStr;
}
function render_calendar(year, month, day) {
    const currentyear = year;
    const currentMonth = month + 1;
    const monthStartDay = new Date(currentyear, currentMonth - 1, 1);
    const monthLastDay = new Date(currentyear, currentMonth, 0);
    const startDayOfWeek = monthStartDay.getDay();
    let elementStr = "<table class='table' id='calendar-table'>";
    let workingHoursList = GetWorkingHour();
    let totalWorkingHour = 0;
    for (let i = 1; i <= monthLastDay.getDate(); i++) {
        totalWorkingHour += workingHoursList[i];
    }
    //날짜 생성
    let [totalWorkingDayCnt,] = GetCommonWorkingDay(monthStartDay, monthLastDay, startDayOfWeek, day);
    let [totalVacationDayCnt,] = GetVacations(monthStartDay, monthLastDay, day);
    let [, minWorkingHour] = GetWorkingHours(monthLastDay.getDate(), totalWorkingDayCnt, totalVacationDayCnt);
    let totalOvertimePay = parseFloat((((totalWorkingHour / 60 - minWorkingHour) * GetPayPerHour()) / 10000).toFixed(1));
    if (totalOvertimePay <= 0)
        totalOvertimePay = 0;
    elementStr += get_calendar_header_elements(currentyear, currentMonth, Number((totalWorkingHour / 60).toFixed(1)), totalOvertimePay);
    elementStr += get_calendar_content_elements(startDayOfWeek, monthLastDay.getDate(), currentyear, currentMonth, day, workingHoursList);
    let element = document.getElementById("calendarArea");
    if (element) {
        element.innerHTML = elementStr;
    }
}
function SetMonth(diff) {
    let [displayDateYear, displayDateMonth, _] = GetDisplayDate();
    if (diff < 0 && displayDateMonth + diff < 0) {
        displayDateYear = displayDateYear - 1;
        displayDateMonth = displayDateMonth + 12 + diff;
        RequestHolidays(displayDateYear);
    }
    else if (diff > 0 && displayDateMonth + diff >= 12) {
        displayDateYear = displayDateYear + 1;
        displayDateMonth = displayDateMonth - 12 + diff;
        RequestHolidays(displayDateYear);
    }
    else {
        displayDateMonth += diff;
    }
    let displayDateDay = 0;
    let today = new Date();
    if (displayDateYear == today.getFullYear() &&
        displayDateMonth == today.getMonth()) {
        displayDateDay = today.getDate();
    }
    SetDisplayDate(displayDateYear, displayDateMonth, displayDateDay);
    RequestWorkingInfos(String(displayDateYear) + "-" + String(displayDateMonth + 1).padStart(2, "0"));
}
function UpdateDayInfo(keyVal, type) {
    UpdateVacations(keyVal, type);
}
