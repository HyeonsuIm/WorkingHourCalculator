function render_working_hour(year, month, day)
{
    const viewYear = year
    const viewMonth = month

    const monthStartDay = new Date(viewYear, viewMonth, 1)
    const monthLastDay = new Date(viewYear, viewMonth+1, 0)
    const startDayOfWeek = monthStartDay.getDay();
    /*document.createElement('<div>`${viewYear}년 ${viewMonth + 1}월`</div>')*/

    //날짜 생성
    let [totalWorkingDayCnt, remainedWorkingDayCnt] = GetWorkingDay(monthStartDay, monthLastDay, startDayOfWeek, day)
    let [maxWorkingHour, avgWorkingHour, minWorkingHour] = GetWorkingHours(monthLastDay.getDate(), totalWorkingDayCnt)

    MakeWorkingHourTable(maxWorkingHour, avgWorkingHour, minWorkingHour)
}

function render_calculated_working_hour(year,month,day)
{
    const viewYear = year
    const viewMonth = month

    const monthStartDay = new Date(viewYear, viewMonth, 1)
    const monthLastDay = new Date(viewYear, viewMonth+1, 0)
    const startDayOfWeek = monthStartDay.getDay();
    
    let [totalWorkingDayCnt, remainedWorkingDayCnt] = GetWorkingDay(monthStartDay, monthLastDay, startDayOfWeek, day)
    let [maxWorkingHour, avgWorkingHour, minWorkingHour] = GetWorkingHours(monthLastDay.getDate(), totalWorkingDayCnt)
    
    SetAllRemainedWorkingHour(remainedWorkingDayCnt, maxWorkingHour, avgWorkingHour, minWorkingHour)
    
    overtime_work_max = maxWorkingHour - minWorkingHour
    overtime_work_based_current = (maxWorkingHour - GetRemainedWorkingHour()) - ((totalWorkingDayCnt - remainedWorkingDayCnt) * 8 )
    if( overtime_work_based_current < 0 )
    {
        overtime_work_based_current = 0
    }
    
    overtime_work_plan = (maxWorkingHour - working_hour_plan) - minWorkingHour
    if( overtime_work_plan < 0 )
    {
        overtime_work_plan = 0
    }
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
            dayOfWeek != 6 &&
            false == IsHoliday(holidayList, monthStartDay.getFullYear(), monthStartDay.getMonth() + 1, i) &&
            false == IsVacation(vacationList, monthStartDay.getFullYear(), monthStartDay.getMonth() + 1, i) )
        {
            dayPlusVal = 1
            if( true == IsVacation(half_vacationList, monthStartDay.getFullYear(), monthStartDay.getMonth() + 1, i))
            {
                dayPlusVal = 0.5
            }
            workingDayCnt += dayPlusVal;
            if(today_date < i)
            {
                workingDayCntAfterToday += dayPlusVal;
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
    SetRemainedWorkingHour("month_max_working_hour", maxWorkingHour)
    SetRemainedWorkingHour("month_min_working_hour", minWorkingHour)
    
}

function SetAllRemainedWorkingHour(workingDayCntAfterToday, maxWorkingHour, avgWorkingHour, minWorkingHour)
{
    remainedWorkingHour = GetRemainedWorkingHour()
    
    remainedMaxWorkingHour = remainedWorkingHour
    remainedPlanWorkingHour = remainedWorkingHour - working_hour_plan
    remainedMinWorkingHour = minWorkingHour - (maxWorkingHour - remainedMaxWorkingHour)

    if( 0 == workingDayCntAfterToday )
    {
        workingDayCntAfterToday = 1
    }

    SetRemainedWorkingHour("daily_working_hour_plan", remainedPlanWorkingHour / workingDayCntAfterToday)
    SetRemainedWorkingHour("daily_working_hour_max", remainedMaxWorkingHour / workingDayCntAfterToday)
    SetRemainedWorkingHour("daily_working_hour_min", remainedMinWorkingHour / workingDayCntAfterToday)
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
    let hour = Math.floor(value)
    let minute = Math.floor(( value - hour ) * 60)
    if( value > 0)
    {
        element.innerText = hour + "h " + Math.round(minute) + "m"
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

    if( -1 == workingPlan )
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

    let element = document.getElementById('overtime_work_based_current')
    if( overtime_work_based_current > 0)
    {
        element.innerText = (Math.floor( overtime_work_based_current * 60 ) * (payPerHour / 60 )).toLocaleString()
    }
    else
    {
        element.innerText = "0"
    }
    
    element = document.getElementById('overnight_pay_max')
    if( overtime_work_max > 0)
    {
        element.innerText = (Math.floor( overtime_work_max * 60 ) * (payPerHour / 60 )).toLocaleString()
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