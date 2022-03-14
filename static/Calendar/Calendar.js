function render_calendar(date, holidayList)
{
    const currentyear = date.getFullYear()
    const currentMonth = date.getMonth() + 1

    const monthStartDay = new Date(currentyear, currentMonth-1, 1)
    const monthLastDay = new Date(currentyear, currentMonth, 0)
    const startDayOfWeek = monthStartDay.getDay();

    elementStr = "<table id='calendar-table'>"
    elementStr +="<tr><td id='year-month' colspan='7'>" + currentyear + "년 " + ( currentMonth ) + "월</td></tr>"
    
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
    
    const displayDay = date.getDate()
    //날짜 생성
    for(i=1;i<=monthLastDay.getDate();i++)
    {
        dayOfWeek = (startDayOfWeek + i -1) % 7
        classStr = ""
        dateStr = currentyear + '-' + String(currentMonth).padStart(2,'0') + '-' + String(i).padStart(2,'0')
        if( -1 != holidayList.indexOf(dateStr) )
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

        idStr = "id='month-day'"
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

    const element = document.getElementById("calendarArea")
    element.innerHTML += elementStr
}