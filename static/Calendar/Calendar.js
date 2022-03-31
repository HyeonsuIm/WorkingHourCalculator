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
        else if( true == IsVacation(vacationList, currentyear, currentMonth, i))
        {
            classStr = "class='vacation'"
            isNeedPopup = true;
        }
        else if( true == IsVacation(half_vacationList, currentyear, currentMonth, i))
        {
            classStr = "class='half_vacation'"
            isNeedPopup = true;
        }
        else
        {
            classStr = "class='working'"
            isNeedPopup = true;

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
        elementStr += "<td " + idStr + " " + classStr + " " + onclickStr + " " + otherAttr + " " + dataId + " >" + i + "</td>"

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