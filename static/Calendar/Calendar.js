const date = new Date();

function renderCalendar()
{
    const viewYear = date.getFullYear()
    const viewMonth = date.getMonth()

    const monthStartDay = new Date(viewYear, viewMonth, 1)
    const monthLastDay = new Date(viewYear, viewMonth+1, 0)
    const startDayOfWeek = monthStartDay.getDay();
    /*document.createElement('<div>`${viewYear}년 ${viewMonth + 1}월`</div>')*/

    elementStr = "<table id='calendar-table'>"
    elementStr +="<tr><td id='year-month' colspan='7'>" + viewYear + "년 " + ( viewMonth + 1 ) + "월</td></tr>"
    
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
    
    //날짜 생성
    for(i=1;i<=monthLastDay.getDate();i++)
    {
        dayOfWeek = (startDayOfWeek + i -1) % 7
        classStr = ""
        if(dayOfWeek == 6)
        {
            classStr = "class='saturday'"
        }
        else if(dayOfWeek == 0)
        {
            classStr = "class='sunday'"
        }
        elementStr += "<td id='month-day' " + classStr + ">" + i + "</td>"

        if( dayOfWeek == 6)
        {
            elementStr += "</tr><tr>"
        }
    }
    elementStr += "</tr></table>"

    const element = document.getElementById("calendarArea")
    element.innerHTML += elementStr
    /*renderWeek(element, startDayOfWeek, 1)*/

/*
    const TLDate = thisLast.getDate();
    const thisDates = [...Array(TLDate + 1).keys()].slice(1);
    thisDates.forEach((date, i) => {
        thisDates[i] = `<div class="date">${date}</div>`;
      })

    document.querySelector('.calendarArea').innerHTML =
     = dates.join('');*/
}