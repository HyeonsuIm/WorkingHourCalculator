const date = new Date();

function renderCalendar()
{
    const viewYear = date.getFullYear()
    const viewMonth = date.getMonth()

    const monthStartDay = new Date(viewYear, viewMonth, 1)
    const monthLastDay = new Date(viewYear, viewMonth+1, 0)
    const startDayOfWeek = monthStartDay.getDay();
    /*document.createElement('<div>`${viewYear}년 ${viewMonth + 1}월`</div>')*/

    elementStr ="<p id='year-month'>" + viewYear + "년 " + ( viewMonth + 1 ) + "월</p>"
    elementStr += "<table style='margin:auto;text-align:center;'><tr>\n"
    for(i=0;i<startDayOfWeek;i++)
    {
        elementStr += "<th id='month-day'>"
    }
    
    for(i=1;i<=monthLastDay.getDate();i++)
    {
        elementStr += "<th id='month-day'>" + i + "</td>"

        if(((7 - startDayOfWeek) - ( i % 7) ) == 0)
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

function renderWeek(element, startDayOfWeek, startPrintDay)
{
    element.innerText += '\n'
    for(i=0;i<startDayOfWeek;i++)
    {
        element.innerText += ' '
    }

    for(i=startDayOfWeek;i<7;i++)
    {
        element.innerText += `${i-startDayOfWeek + startPrintDay}일`
        element.innerText += ' '
    }
}