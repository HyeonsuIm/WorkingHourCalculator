function get_calendar_header_elements(currentyear, currentMonth, totalWorkingHour, getPaid)
{
    let elementStr = "<tr>\
        <td class='calendar_header'><button id='prev_button' class='btn btn-light' onclick='SetMonth(-1)'><</button></td>\
        <td class='calendar_header' id='year-month' colspan='5'>\
            <div style='position:relative;display:block;'>\
                " + currentyear + "년 " + ( currentMonth ) + "월\
                <div style='line-height:15px;display:block;position:absolute;top:-5px;right:0px;bottom:auto'>"
    if(totalWorkingHour > 0 )
    {
        elementStr += "<div style='float:left;text-align:left'><font size='2' color='#1c1c1c'>근무<br>야근</font></div>"
        elementStr += "<div style='float:right;text-align:left'><font size='2' color='#1c1c1c'>" + totalWorkingHour + "시간<br>" + getPaid + "만원</font></div>"
    }
                    
    elementStr += "\
                </div>\
            </div>\
        </td>\
        <td class='calendar_header'><button id='next_button' class='btn btn-light' onclick='SetMonth(1)'>></button></td></tr>"
    
    // 요일 생성
    elementStr += "<tr><td class='sunday' id='month-weekday'>일</td>"
    elementStr += "<td id='month-weekday'>월</td>"
    elementStr += "<td id='month-weekday'>화</td>"
    elementStr += "<td id='month-weekday'>수</td>"
    elementStr += "<td id='month-weekday'>목</td>"
    elementStr += "<td id='month-weekday'>금</td>"
    elementStr += "<td class='saturday' id='month-weekday'>토</td></tr>"

    return elementStr;
}

function get_calendar_content_elements(startDayOfWeek, lastDay, currentyear, currentMonth, day, workingHours)
{
    // 앞쪽 빈칸
    let elementStr = "<tr>"
    for(i=0;i<startDayOfWeek;i++)
    {
        elementStr += "<td id='month-day-empty'> </td>"
    }

    let displayDay = day
    let dayOfWeek = 0

    //날짜 및 근무시간 생성
    for(i=1;i<=lastDay;i++)
    {
        dayOfWeek = (startDayOfWeek + i - 1) % 7
        let classStr = ""
        let onclickStr = ""
        let otherAttr = ""
        let dataId= ""
        let isNeedPopup = false
        if( true == IsHoliday(holidayList, currentyear, currentMonth, i) )
        {
            classStr = "class='holiday'"
        }
        else if(dayOfWeek == 6)
        {
            classStr = "class='saturday'"
        }
        else if(dayOfWeek == 0)
        {
            classStr = "class='sunday'"
        }
        else
        {
            isNeedPopup = true;
            if( true == IsVacation(vacationList, currentyear, currentMonth, i))
            {
                classStr = "class='vacation'"
            }
            else if( true == IsVacation(half_vacationList, currentyear, currentMonth, i))
            {
                classStr = "class='half_vacation'"
            }
            else
            {
                classStr = "class='working'"
            }
        }


        if( true == isNeedPopup )
        {
            onclickStr = "onclick='displayModal(this)'"
            otherAttr = "data-toggle='modal' style='cursor:pointer;'"
            dataId += "data-id='"+ currentyear + "-" + String(currentMonth).padStart(2,'0') + "-" + String(i).padStart(2,'0') + "'"
        }

        let idStr ="id="
        if( displayDay == i)
        {
            idStr += "'month-day-today'"
        }
        else
        {
            idStr += "'month-day'"
        }

        workingHour = ""
        if(workingHours[i] != 0)
        {
            workingHour += Math.floor((workingHours[i] / 60)) + ":" + String(workingHours[i] % 60).padStart(2,'0')
        }

        elementStr += "<td " + idStr + " " + classStr + " " + onclickStr + " " + otherAttr + " " + dataId + " >" + i + "<br>" + workingHour + "</td>"

        if( dayOfWeek == 6)
        {
            elementStr += "</tr><tr>"
        }
    }

    // 뒤쪽 빈칸
    for(;dayOfWeek < 6;dayOfWeek++)
    {
        elementStr += "<td id='month-day-empty'></td>"
    }
    elementStr += "</tr></table>"

    return elementStr;
}

function render_calendar(year, month, day)
{
    const currentyear = year
    const currentMonth = month + 1

    const monthStartDay = new Date(currentyear, currentMonth-1, 1)
    const monthLastDay = new Date(currentyear, currentMonth, 0)
    const startDayOfWeek = monthStartDay.getDay();

    let elementStr = "<table class='table' id='calendar-table'>"

    let workingHours = GetWorkingHour(currentyear, currentMonth)
    let totalWorkingHour=0
    for(i=1;i<=monthLastDay.getDate();i++)
    {
        totalWorkingHour += workingHours[i]
    }

    //날짜 생성
    let [totalWorkingDayCnt, remainedWorkingDayCnt] = GetWorkingDay(monthStartDay, monthLastDay, startDayOfWeek, day)
    let [maxWorkingHour, avgWorkingHour, minWorkingHour] = GetWorkingHours(monthLastDay.getDate(), totalWorkingDayCnt)
    
    let totalOvertimePay = (((totalWorkingHour/60-minWorkingHour) * payPerHour) / 10000).toFixed(1)
    if (totalOvertimePay <= 0) totalOvertimePay = 0
    elementStr += get_calendar_header_elements(currentyear, currentMonth, (totalWorkingHour/60).toFixed(0), totalOvertimePay)
    elementStr += get_calendar_content_elements(startDayOfWeek, monthLastDay.getDate(), currentyear, currentMonth, day, workingHours)

    let element = document.getElementById("calendarArea")
    element.innerHTML = elementStr
}

function SetMonth(diff)
{
    if( diff < 0 &&  displayDateMonth + diff < 0)
    {
        displayDateYear = displayDateYear - 1
        displayDateMonth = displayDateMonth + 12 + diff
    }
    else if( diff > 0 && displayDateMonth + diff >= 12)
    {
        displayDateYear = displayDateYear + 1
        displayDateMonth = displayDateMonth - 12 + diff
    }
    else
    {
        displayDateMonth += diff
    }

    displayDateDay = 0
    if( displayDateYear == today.getFullYear() &&
        displayDateMonth == today.getMonth() )
    {
        displayDateDay = today.getDate()
    }

    UpdateAllViews()
}

function displayHolidayPopup(year, month, day)
{
    var isVacation = confirm('휴가?')
    if( true == isVacation )
    {
        AddVacationDayInformation(year, month,day,isVacation)
    }
    else
    {
        RemoveVacationDayInformation(year,month,day)
    }
    UpdateAllVacation()
    UpdateAllViews()
}

function AddVacationDayInformation(year,month,date,isFullVacation)
{
    const vacationKey = "vacation_"+year+"-"+ String(month).padStart(2,'0') + "-" + String(date).padStart(2,'0')
    localStorage.setItem(vacationKey, isFullVacation)
}

function RemoveVacationDayInformation(year,month,date)
{
    const vacationKey = "vacation_"+year+"-"+ String(month).padStart(2,'0') + "-" + String(date).padStart(2,'0')
    localStorage.removeItem(vacationKey)
}

function UpdateAllVacation()
{
    vacationList = []
    half_vacationList = []
    for( let key in localStorage )
    {
        vacationType = localStorage.getItem(key)
        if( 1 == vacationType )
        {
            //let [year, month,day] = key.split('-',3)
            vacationList.push(key)
        }
        else if( 2 == vacationType)
        {
            half_vacationList.push(key)
        }
    }
}

function UpdateDayInfo(keyVal, type)
{
    if( type == 'full_day')
    {
        localStorage.setItem(keyVal, 1)
    }
    else if( type == 'half_day')
    {
        localStorage.setItem(keyVal, 2)
    }
    else
    {
        localStorage.removeItem(keyVal)
    }
    UpdateAllVacation();
    UpdateAllViews();
}

function GetWorkingHour(year, month)
{
    const workingHourKey = "WorkingHour:"+String(year)+"-"+ String(month).padStart(2,'0')
    let datas = localStorage.getItem(workingHourKey)
    if( null === datas)
    {
        datas = Array.from({length:32},()=>0)
    }
    else
    {
        datas = JSON.parse(datas)
    }
    return datas
}