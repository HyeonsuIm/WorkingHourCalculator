function render_working_hour(date)
{
    const viewYear = date.getFullYear()
    const viewMonth = date.getMonth()
    const viewDay = date.getDate()

    const monthStartDay = new Date(viewYear, viewMonth, 1)
    const monthLastDay = new Date(viewYear, viewMonth+1, 0)
    const startDayOfWeek = monthStartDay.getDay();
    /*document.createElement('<div>`${viewYear}년 ${viewMonth + 1}월`</div>')*/

    //날짜 생성
    let [totalWorkingDayCnt, remainedWorkingDayCnt] = GetWorkingDay(monthStartDay, monthLastDay, startDayOfWeek, viewDay)
    let [maxWorkingHour, avgWorkingHour, minWorkingHour] = GetWorkingHours(monthLastDay.getDate(), totalWorkingDayCnt, remainedWorkingDayCnt)

    MakeWorkingHourTable(maxWorkingHour, avgWorkingHour, minWorkingHour)
    SetAllRemainedWorkingHour(remainedWorkingDayCnt, maxWorkingHour, avgWorkingHour, minWorkingHour)
}

function GetWorkingDay(monthStartDay, monthLastDay, startDayOfWeek, today_date)
{
    totalDayCnt = monthLastDay.getDate()
    let workingDayCnt = 0
    let workingDayCntAfterToday = 0
    for(i=1;i<=totalDayCnt;i++)
    {
        dayOfWeek = (startDayOfWeek + i -1) % 7
        if( dayOfWeek != 0 &&
            dayOfWeek != 6)
        {
            workingDayCnt++;
            if(today_date < i)
            {
                workingDayCntAfterToday++;
            }
        }
    }
    return [workingDayCnt, workingDayCntAfterToday]
}

function GetWorkingHours(totalDayCnt, totalWorkingDayCnt, remainedWorkingDayCnt)
{
    let maxWorkingHour = totalDayCnt / 7 * 52;
    let minWorkingHour = totalWorkingDayCnt * 8 < totalDayCnt / 7 * 40 ? totalWorkingDayCnt * 8 : totalDayCnt / 7 * 40
    let avgWorkingHour = maxWorkingHour * 0.9
    return [maxWorkingHour, avgWorkingHour, minWorkingHour]
}

function MakeWorkingHourTable(maxWorkingHour, avgWorkingHour, minWorkingHour)
{
    elementStr = "<table id='working-hour-table' style='border:1px solid;width:448px;text-align:left'>"
    elementStr +="<tr><th>최대 근무가능 시간</th></tr>"
    
    // 요일 생성
    elementStr += "<tr><td>" + Math.round(maxWorkingHour*100)/100 +"</td></tr>"
    elementStr += "</table>"

    element = document.getElementById("month_working_hour")
    element.innerHTML = elementStr
}

function SetAllRemainedWorkingHour(workingDayCntAfterToday, maxWorkingHour, avgWorkingHour, minWorkingHour)
{
    remainedWorkingHour = document.getElementById("working_done").value
    
    remainedMaxWorkingHour = remainedWorkingHour
    remainedAvgWorkingHour = remainedWorkingHour - maxWorkingHour * 0.1
    remainedMinWorkingHour = minWorkingHour - (maxWorkingHour - remainedMaxWorkingHour)

    SetRemainedWorkingHour("daily_working_hour_max", Math.round( remainedMaxWorkingHour / workingDayCntAfterToday * 100) / 100)
    SetRemainedWorkingHour("daily_working_hour_avg", Math.round( remainedAvgWorkingHour / workingDayCntAfterToday * 100) / 100)
    SetRemainedWorkingHour("daily_working_hour_min", Math.round( remainedMinWorkingHour / workingDayCntAfterToday * 100) / 100)
}

function SetRemainedWorkingHour(elementId, value)
{
    element = document.getElementById(elementId)
    if( value > 0)
    {
        element.innerText = value
    }
    else
    {
        element.innerText = "0"
    }
}