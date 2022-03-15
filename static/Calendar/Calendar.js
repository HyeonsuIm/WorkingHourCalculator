function render_calendar(date, current_date, holidayList)
{
    const currentyear = date.getFullYear()
    const currentMonth = date.getMonth() + 1

    const monthStartDay = new Date(currentyear, currentMonth-1, 1)
    const monthLastDay = new Date(currentyear, currentMonth, 0)
    const startDayOfWeek = monthStartDay.getDay();

    let elementStr = "<table id='calendar-table'>"
    elementStr +="<tr>\
    <td><button id='prev_button' class='calendar_button' onclick='SetMonth(-1)'><</button></td>\
    <td id='year-month' colspan='5'>" + currentyear + "년 " + ( currentMonth ) + "월</td>\
    <td><button id='next_button' class='calendar_button' onclick='SetMonth(1)'>></button></td></tr>"
    
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
    
    let displayDay = current_date
    //날짜 생성
    for(i=1;i<=monthLastDay.getDate();i++)
    {
        let dayOfWeek = (startDayOfWeek + i - 1) % 7
        let classStr = ""
        
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

        let idStr = "id='month-day'"
        if( displayDay == i)
        {
            idStr = "id='month-day-today'"
        }
        elementStr += "<td " + idStr + " " + classStr + ">" + i + "</td>"

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
    if( diff < 0 &&  current_date.getMonth() + diff < 0)
    {
        current_date.setFullYear(current_date.getFullYear()-1)
        current_date.setMonth(current_date.getMonth() + 12 + diff)
    }
    else if( diff > 0 && current_date.getMonth() + diff > 12)
    {
        current_date.setFullYear(current_date.getFullYear() + 1)
        current_date.setMonth(current_date.getMonth() - 12 + diff)
    }
    else
    {
        current_date.setMonth(current_date.getMonth() + diff)
    }

    let dateTemp = new Date()
    let displayDay = 0
    if( current_date.getFullYear() == dateTemp.getFullYear() &&
        current_date.getMonth() == dateTemp.getMonth() )
    {
        displayDay = dateTemp.getDate()
    }
    render_calendar(current_date, displayDay, holidayList)
    render_working_hour(current_date, displayDay, holidayList)
}