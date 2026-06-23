import { MakeWorkingHourMiniuteString, IsHolidayWorking, IsHoliday, IsVacation, IsHalfVacation, GetHolidayName } from './CalendarAPI'
import { GetCommonWorkingDay, GetVacations, GetWorkingHours, GetPayPerHour } from './WorkingHour'
import { GetWorkingHour, RequestHolidays, RequestWorkingInfos } from '../Datas/DataStorageHandler'
import { GetDisplayDate, SetDisplayDate } from './CalendarViewHandler'
import { UpdateVacations } from '../Datas/DataStorageHandler'

function get_calendar_header_elements(currentyear: number, currentMonth: number, totalWorkingHour: number, getPaid: number): string {
    const statsHtml = totalWorkingHour > 0
        ? `<div class='cal-stats'><span class='cal-stat-item'><span class='cal-stat-label'>근무</span><span class='cal-stat-value'>${totalWorkingHour}시간</span></span><span class='cal-stat-item'><span class='cal-stat-label'>야근</span><span class='cal-stat-value'>${getPaid}만원</span></span></div>`
        : ''

    let elementStr = `<tr><td class='calendar_header'><button id='prev_button' class='btn' onclick='SetMonth(-1)'>&#8249;</button></td>`
    elementStr += `<td class='calendar_header' id='year-month' colspan='6'><div class='cal-title-wrap'><span class='cal-year'>${currentyear}</span><span class='cal-month'>${currentMonth}월</span>${statsHtml}</div></td>`
    elementStr += `<td class='calendar_header'><button id='next_button' class='btn' onclick='SetMonth(1)'>&#8250;</button></td></tr>`

    elementStr += "<tr>"
    elementStr += "<td class='sunday' id='month-weekday'>일</td>"
    elementStr += "<td id='month-weekday'>월</td>"
    elementStr += "<td id='month-weekday'>화</td>"
    elementStr += "<td id='month-weekday'>수</td>"
    elementStr += "<td id='month-weekday'>목</td>"
    elementStr += "<td id='month-weekday'>금</td>"
    elementStr += "<td class='saturday' id='month-weekday'>토</td>"
    elementStr += "<td id='month-weekday'>합계</td>"
    elementStr += "</tr>"
    return elementStr;
}

function get_calendar_content_elements(startDayOfWeek: number, lastDay: number, currentyear: number, currentMonth: number, day: number, workingHours: number[]): string {
    let elementStr = "<tr>"
    for (let i = 0; i < startDayOfWeek; i++) elementStr += "<td id='month-day-empty'> </td>"
    let displayDay = day
    let dayOfWeek = 0
    let weekWorkingHour = 0
    for (let i = 1; i <= lastDay; i++) {
        dayOfWeek = (startDayOfWeek + i - 1) % 7
        let classStr = ""
        let onclickStr = ""
        let otherAttr = ""
        let dataId = ""
        if (true == IsHolidayWorking(currentyear, currentMonth, i)) classStr = "class='working'"
        else if (true == IsHoliday(currentyear, currentMonth, i)) classStr = "class='holiday'"
        else if (dayOfWeek == 6) classStr = "class='saturday'"
        else if (dayOfWeek == 0) classStr = "class='sunday'"
        else {
            if (true == IsVacation(currentyear, currentMonth, i)) classStr = "class='vacation'"
            else if (true == IsHalfVacation(currentyear, currentMonth, i)) classStr = "class='half_vacation'"
            else classStr = "class='working'"
        }
        onclickStr = "onclick='displayModal(this)'"
        otherAttr = "data-toggle='modal' style='cursor:pointer;'"
        dataId += "data-id='" + currentyear + "-" + String(currentMonth).padStart(2, '0') + "-" + String(i).padStart(2, '0') + "'"
        let idStr = "id="
        if (displayDay == i) idStr += "'month-day-today'"
        else idStr += "'month-day'"
        weekWorkingHour += workingHours[i]
        const holidayName = (IsHoliday(currentyear, currentMonth, i) || IsHolidayWorking(currentyear, currentMonth, i))
            ? GetHolidayName(currentyear, currentMonth, i) : ''
        const holidayLabel = holidayName ? `<span class="holiday-name">${holidayName}</span>` : ''
        elementStr += "<td " + idStr + " " + classStr + " " + onclickStr + " " + otherAttr + " " + dataId + " >" + i + holidayLabel + "<br><h6>" + MakeWorkingHourMiniuteString(workingHours[i]) + "</h6></td>"
        if (dayOfWeek == 6) {
            elementStr += "<td><br><h6>" + MakeWorkingHourMiniuteString(weekWorkingHour) + "</h6></td>"
            elementStr += "</tr><tr>"
            weekWorkingHour = 0
        }
    }
    if (dayOfWeek < 6) {
        for (; dayOfWeek < 6; dayOfWeek++) elementStr += "<td id='month-day-empty'></td>"
        elementStr += "<td><br><h6>" + MakeWorkingHourMiniuteString(weekWorkingHour) + "</h6></td>"
    }
    elementStr += "</tr></table>"
    return elementStr;
}

export function render_calendar(year: number, month: number, day: number) {
    const currentyear = year
    const currentMonth = month + 1
    const monthStartDay = new Date(currentyear, currentMonth - 1, 1)
    const monthLastDay = new Date(currentyear, currentMonth, 0)
    const startDayOfWeek = monthStartDay.getDay();
    let elementStr = "<table class='table' id='calendar-table'>"
    let workingHoursList = GetWorkingHour()
    let totalWorkingHour = 0
    for (let i = 1; i <= monthLastDay.getDate(); i++) totalWorkingHour += workingHoursList[i]
    let [totalWorkingDayCnt,] = GetCommonWorkingDay(monthStartDay, monthLastDay, startDayOfWeek, day)
    let [totalVacationDayCnt,] = GetVacations(monthStartDay, monthLastDay, day)
    let [, minWorkingHour] = GetWorkingHours(monthLastDay.getDate(), totalWorkingDayCnt, totalVacationDayCnt)
    let totalOvertimePay = parseFloat((((totalWorkingHour / 60 - minWorkingHour) * GetPayPerHour()) / 10000).toFixed(1))
    if (totalOvertimePay <= 0) totalOvertimePay = 0
    elementStr += get_calendar_header_elements(currentyear, currentMonth, Number((totalWorkingHour / 60).toFixed(1)), totalOvertimePay)
    elementStr += get_calendar_content_elements(startDayOfWeek, monthLastDay.getDate(), currentyear, currentMonth, day, workingHoursList)
    let element = document.getElementById("calendarArea")
    if (element) element.innerHTML = elementStr
}

export function SetMonth(diff: number) {
    let [displayDateYear, displayDateMonth, _] = GetDisplayDate()
    if (diff < 0 && displayDateMonth + diff < 0) {
        displayDateYear = displayDateYear - 1
        displayDateMonth = displayDateMonth + 12 + diff
        RequestHolidays(displayDateYear)
    } else if (diff > 0 && displayDateMonth + diff >= 12) {
        displayDateYear = displayDateYear + 1
        displayDateMonth = displayDateMonth - 12 + diff
        RequestHolidays(displayDateYear)
    } else {
        displayDateMonth += diff
    }
    let displayDateDay = 0
    let today = new Date()
    if (displayDateYear == today.getFullYear() && displayDateMonth == today.getMonth()) displayDateDay = today.getDate()
    SetDisplayDate(displayDateYear, displayDateMonth, displayDateDay)
    RequestWorkingInfos(String(displayDateYear) + "-" + String(displayDateMonth + 1).padStart(2, "0"))
}

export function UpdateDayInfo(keyVal: string, type: number) { UpdateVacations(keyVal, type) }
