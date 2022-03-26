function render_working_hour(date, current_date)
{
    const viewYear = date.getFullYear()
    const viewMonth = date.getMonth()

    const monthStartDay = new Date(viewYear, viewMonth, 1)
    const monthLastDay = new Date(viewYear, viewMonth+1, 0)
    const startDayOfWeek = monthStartDay.getDay();
    /*document.createElement('<div>`${viewYear}년 ${viewMonth + 1}월`</div>')*/

    //날짜 생성
    let [totalWorkingDayCnt, remainedWorkingDayCnt] = GetWorkingDay(holidayList, vacationList, monthStartDay, monthLastDay, startDayOfWeek, current_date)
    let [maxWorkingHour, avgWorkingHour, minWorkingHour] = GetWorkingHours(monthLastDay.getDate(), totalWorkingDayCnt)

    MakeWorkingHourTable(maxWorkingHour, avgWorkingHour, minWorkingHour)
    SetAllRemainedWorkingHour(remainedWorkingDayCnt, maxWorkingHour, avgWorkingHour, minWorkingHour)
    
    overtime_work = (maxWorkingHour - GetRemainedWorkingHour()) - minWorkingHour
    if( overtime_work < 0 )
    {
        overtime_work = 0
    }
    
    overtime_work_plan = (maxWorkingHour - working_hour_plan) - minWorkingHour
    if( overtime_work_plan < 0 )
    {
        overtime_work_plan = 0
    }

    renderOvernightPay()
}

function GetWorkingDay(holidayList, vacationList, monthStartDay, monthLastDay, startDayOfWeek, today_date)
{
    totalDayCnt = monthLastDay.getDate()
    let workingDayCnt = 0
    let workingDayCntAfterToday = 0
    for(i=1;i<=totalDayCnt;i++)
    {
        dayOfWeek = (startDayOfWeek + i -1) % 7
        if( dayOfWeek != 0 &&
            dayOfWeek != 6 &&
            false == IsHoliday(holidayList, monthStartDay.getFullYear(), monthStartDay.getMonth() + 1, i) &&
            false == IsVacation(vacationList, monthStartDay.getFullYear(), monthStartDay.getMonth() + 1, i) )
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

function GetWorkingHours(totalDayCnt, totalWorkingDayCnt)
{
    let maxWorkingHour = totalDayCnt / 7 * 52;
    let minWorkingHour = totalWorkingDayCnt * 8 < totalDayCnt / 7 * 40 ? totalWorkingDayCnt * 8 : totalDayCnt / 7 * 40;
    let avgWorkingHour = maxWorkingHour * 0.9
    return [maxWorkingHour, avgWorkingHour, minWorkingHour]
}

function MakeWorkingHourTable(maxWorkingHour, avgWorkingHour, minWorkingHour)
{
    element = document.getElementById("month_max_working_hour")
    element.innerHTML = Math.round(maxWorkingHour*100)/100
}

function SetAllRemainedWorkingHour(workingDayCntAfterToday, maxWorkingHour, avgWorkingHour, minWorkingHour)
{
    remainedWorkingHour = GetRemainedWorkingHour()
    
    remainedMaxWorkingHour = remainedWorkingHour
    remainedPlanWorkingHour = remainedWorkingHour - working_hour_plan
    remainedMinWorkingHour = minWorkingHour - (maxWorkingHour - remainedMaxWorkingHour)

    SetRemainedWorkingHour("daily_working_hour_plan", Math.round( remainedPlanWorkingHour / workingDayCntAfterToday * 100) / 100)
    SetRemainedWorkingHour("daily_working_hour_max", Math.round( remainedMaxWorkingHour / workingDayCntAfterToday * 100) / 100)
    SetRemainedWorkingHour("daily_working_hour_min", Math.round( remainedMinWorkingHour / workingDayCntAfterToday * 100) / 100)
}

function GetRemainedWorkingHour()
{
    const remainedWorkingHourKey = "remainWorkingHour"
    let workingDoneElement = document.getElementById("working_done")
    let remainedWorkingHour = workingDoneElement.value
    let remainedWorkingHourCache = localStorage.getItem(remainedWorkingHourKey)
    if( 0 == remainedWorkingHour )
    {
        remainedWorkingHour = remainedWorkingHourCache
        workingDoneElement.value = remainedWorkingHourCache
    }
    else
    {
        localStorage.setItem(remainedWorkingHourKey, remainedWorkingHour)
    }
    
    return remainedWorkingHour
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

function updateWorkingPlan()
{
    let workingPlanElement = document.getElementById('working_plan')
    let workingPlan = workingPlanElement.value

    if( 0 == workingPlan )
    {
        workingPlanElement.value = localStorage.getItem('working_plan')
        workingPlan = workingPlanElement.value
    }
    else
    {
        localStorage.setItem('working_plan', workingPlan)
    }
    
    working_hour_plan = workingPlan
}

function renderOvernightPay()
{
    let payPerHourElement = document.getElementById("overnight_pay_per_hour")
    let payPerHour = payPerHourElement.value

    if( 0 == payPerHour )
    {
        payPerHourElement.value = localStorage.getItem('overtime_pay')
        payPerHour = payPerHourElement.value
    }
    else
    {
        localStorage.setItem('overtime_pay', payPerHour)
    }
    
    let element = document.getElementById('overnight_pay')
    if( overtime_work > 0)
    {
        element.innerText = (Math.floor( overtime_work * 60 ) * (payPerHour / 60 )).toLocaleString()
    }
    else
    {
        element.innerText = "0"
    }

    element = document.getElementById('overnight_pay_plan')
    if( overtime_work_plan > 0)
    {
        element.innerText = (Math.floor( overtime_work_plan * 60 ) * (payPerHour / 60 )).toLocaleString()
    }
    else
    {
        element.innerText = "0"
    }
}