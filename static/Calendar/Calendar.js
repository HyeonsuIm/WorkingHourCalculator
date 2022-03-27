function render_calendar(year, month, day)
{
    const currentyear = year
    const currentMonth = month + 1

    const monthStartDay = new Date(currentyear, currentMonth-1, 1)
    const monthLastDay = new Date(currentyear, currentMonth, 0)
    const startDayOfWeek = monthStartDay.getDay();

    let elementStr = "<table class='table' id='calendar-table'>"
    elementStr +="<tr>\
    <td class='calendar_header'><button id='prev_button' class='btn btn-light' onclick='SetMonth(-1)'><</button></td>\
    <td class='calendar_header' id='year-month' colspan='5'>" + currentyear + "년 " + ( currentMonth ) + "월</td>\
    <td class='calendar_header'><button id='next_button' class='btn btn-light' onclick='SetMonth(1)'>></button></td></tr>"
    
    // 요일 생성
    elementStr += "<tr><td class='sunday' id='month-weekday'>일</td>"
    elementStr += "<td id='month-weekday'>월</td>"
    elementStr += "<td id='month-weekday'>화</td>"
    elementStr += "<td id='month-weekday'>수</td>"
    elementStr += "<td id='month-weekday'>목</td>"
    elementStr += "<td id='month-weekday'>금</td>"
    elementStr += "<td class='saturday' id='month-weekday'>토</td></tr>"
    
    // 앞쪽 빈칸
    elementStr += "<tr>"
    for(i=0;i<startDayOfWeek;i++)
    {
        elementStr += "<td id='month-day-empty'> </td>"
    }
    
    let displayDay = day
    //날짜 생성
    for(i=1;i<=monthLastDay.getDate();i++)
    {
        let dayOfWeek = (startDayOfWeek + i - 1) % 7
        let classStr = ""
        let onclickStr = ""
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
        else if( true == IsVacation(vacationList, currentyear, currentMonth, i))
        {
            classStr = "class='vacation'"
            onclickStr = "onclick='displayHolidayPopup(" + currentyear + "," +currentMonth + "," + i + ")'"
        }
        else
        {
            onclickStr = "onclick='displayHolidayPopup(" + currentyear + "," +currentMonth + "," + i + ")'"
        }

        let idStr = "id='month-day'"
        if( displayDay == i)
        {
            idStr = "id='month-day-today'"
        }
        elementStr += "<td " + idStr + " " + classStr + " " + onclickStr + " >" + i + "</td>"

        if( dayOfWeek == 6)
        {
            elementStr += "</tr><tr>"
        }
    }
    elementStr += "</tr></table>"

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
    else if( diff > 0 && displayDateMonth + diff > 12)
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
    render_calendar(displayDateYear, displayDateMonth, displayDateDay)
    render_working_hour(displayDateYear, displayDateMonth, displayDateDay)
}

function displayHolidayPopup(year, month, day)
{
    var isVacation = confirm('휴가?')
    UpdateVacationDayInformation(year, month,day,isVacation)
    UpdateAllVacation(vacationList)

    render_calendar(displayDateYear, displayDateMonth, displayDateDay)
    render_working_hour(displayDateYear, displayDateMonth, displayDateDay)
}

function UpdateVacationDayInformation(year,month,date,isVacation)
{
    const vacationKey = "vacation_"+year+"-"+ String(month).padStart(2,'0') + "-" + String(date).padStart(2,'0')
    localStorage.setItem(vacationKey, isVacation)
}

function UpdateAllVacation()
{
    vacationList = []
    for( let key in localStorage )
    {
        isVacation = localStorage.getItem(key)
        if( "false" != isVacation )
        {
            let startIndex = key.indexOf('vacation_')
            if( 0 == startIndex )
            {
                key = key.substring(startIndex+('vacation_').length)
                //let [year, month,day] = key.split('-',3)
                vacationList.push(key)
            }
        }
    }
}