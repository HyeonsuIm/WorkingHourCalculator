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
    
    SetAllRemainedWorkingHour(remainedWorkingDayCnt, maxWorkingHour, minWorkingHour)
    
    overtime_work_max = maxWorkingHour - minWorkingHour
    normal_work_hour = (totalWorkingDayCnt - remainedWorkingDayCnt) * 8
    normal_remain_work_hour = remainedWorkingDayCnt * 8
    curr_work_hour = maxWorkingHour - GetRemainedWorkingHour()
    overtime_work_based_current = curr_work_hour - normal_work_hour
    if( normal_remain_work_hour > GetRemainedWorkingHour())
    {
        overtime_work_based_current = overtime_work_max
    }
    else
    {
        if( overtime_work_based_current < 0 )
        {
            overtime_work_based_current = 0
        }
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
        if( true == IsWorkingDay(holidayList, vacationList, monthStartDay.getFullYear(), monthStartDay.getMonth() + 1, i, dayOfWeek) )
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

function SetAllRemainedWorkingHour(workingDayCntAfterToday, maxWorkingHour, minWorkingHour)
{
    remainedWorkingHour = GetRemainedWorkingHour()

    remainedMaxWorkingHour = remainedWorkingHour
    remainedPlanWorkingHour = remainedWorkingHour - working_hour_plan
    expectWorkingHour = (( working_overpay_plan / payPerHour ) + minWorkingHour) - (maxWorkingHour - remainedWorkingHour) // 예상남은근무시간 = 근무해야 하는 시간 - 현재까지 근무한 시간
    remainedMinWorkingHour = minWorkingHour - (maxWorkingHour - remainedMaxWorkingHour)

    if( 0 == workingDayCntAfterToday )
    {
        workingDayCntAfterToday = 1
    }

    SetRemainedWorkingHour("daily_working_hour_plan", remainedPlanWorkingHour / workingDayCntAfterToday)
    SetRemainedWorkingHour("daily_working_hour_max", remainedMaxWorkingHour / workingDayCntAfterToday)
    SetRemainedWorkingHour("daily_working_hour_min", remainedMinWorkingHour / workingDayCntAfterToday)
    SetRemainedWorkingHour("daily_working_hour_overpay_plan", expectWorkingHour / workingDayCntAfterToday)
}

function GetRemainedWorkingHour()
{
    const remainedWorkingHourKey = "remainWorkingHour"
    let remainedWorkingHourArr = JSON.parse(localStorage.getItem(remainedWorkingHourKey))
    remainedWorkingHour = parseFloat(remainedWorkingHourArr['remain_hour']);
    
    return remainedWorkingHour - today_remain_time_minute / 60
}

function GetRemainedWorkingStoreTime()
{
    const remainedWorkingHourKey = "remainWorkingHour"
    let remainedWorkingHourArr = JSON.parse(localStorage.getItem(remainedWorkingHourKey))
    let storeTime = remainedWorkingHourArr['store_time'];
    
    return storeTime
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

function updateWorkingOverpayPlan()
{
    let overpayElement = document.getElementById('working_overpay')
    let overpayPlan = overpayElement.value

    if( -1 == overpayPlan )
    {
        overpayElement.value = localStorage.getItem('working_overpay')
        overpayPlan = overpayElement.value
    }
    else
    {
        localStorage.setItem('working_overpay', overpayPlan)
    }
    
    if( overpayPlan < 0 )
    {
        overpayPlan = 0
    }
    working_overpay_plan = overpayPlan
}

function UpdateRemainWorkingHourAndUpdate()
{
    UpdateRemainWorkingHour()
    updateWorkingOverpayPlan()
    UpdateLeaveWorkTime()
    UpdateAllViews()
}

function UpdateRemainWorkingHour()
{
    const remainedWorkingHourKey = "remainWorkingHour"
    let workingDoneElement = document.getElementById("working_done")
    let today = new Date()
    let remainedWorkingHour = workingDoneElement.value
    let isSet = false
    if( -1 == remainedWorkingHour )
    {
        let storageData = JSON.parse(localStorage.getItem(remainedWorkingHourKey))
        if( typeof(storageData) == "object" )
        {
            workingDoneElement.value = storageData['remain_hour']
            remainedWorkingHour = storageData['remain_hour']
            isSet = true
        }
    }
    
    if( false == isSet)
    {
        let storageData = 
        {
            remain_hour:remainedWorkingHour,
            store_time:today
        }
        localStorage.setItem(remainedWorkingHourKey, JSON.stringify(storageData))
    }
}

function UpdateOvernightPayHour()
{
    let payPerHourElement = document.getElementById("overnight_pay_hour")
    payPerHour = payPerHourElement.value

    if( 0 == payPerHour )
    {
        payPerHourElement.value = localStorage.getItem('overtime_pay')
        payPerHour = payPerHourElement.value
    }
    else
    {
        localStorage.setItem('overtime_pay', payPerHour)
    }
}

function renderOvernightPay()
{
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

function UpdateLeaveWorkTimeAndUpdate()
{
    UpdateLeaveWorkTime()
    UpdateAllViews()
}

function UpdateLeaveWorkTime()
{
    let payPerHourElement = document.getElementById("leave_work_time")
    let leave_time = payPerHourElement.value
    const leave_time_key = 'leave_work_time'
    if(leave_time == "")
    {
        if( -1 != Object.keys(localStorage).indexOf(leave_time_key) )
        {
            payPerHourElement.value = localStorage.getItem(leave_time_key)
            leave_time = localStorage.getItem(leave_time_key)
        }
        else
        {
            leave_time = "18:00"
        }
    }
    else
    {
        localStorage.setItem(leave_time_key, leave_time)
    }
    let today = new Date()
    let store_time = new Date(GetRemainedWorkingStoreTime())
    if( today.getMonth() == store_time.getMonth() &&
        today.getDate() == store_time.getDate() &&
        true == IsWorkingDay(holidayList, vacationList, today.getFullYear(), today.getMonth(), today.getDate(), today.getDay()))
    {
        let lunch_start_time_minute = 12 * 60 + 30
        let lunch_finish_time_minute = 13 * 60 + 30

        let store_time_minute = store_time.getHours() * 60 + store_time.getMinutes()
        let leave_time_minute = parseInt(leave_time.split(':')[0] * 60) + parseInt(leave_time.split(':')[1])
        if( store_time_minute < lunch_start_time_minute)
        {
            today_remain_time_minute = leave_time_minute - store_time_minute - 60
        }
        else if(store_time_minute < lunch_finish_time_minute)
        {
            today_remain_time_minute = leave_time_minute - store_time_minute - (lunch_finish_time_minute - store_time_minute)
        }
        else
        {
            today_remain_time_minute = leave_time_minute - store_time_minute
        }
    }
    else
    {
        today_remain_time_minute = 0
    }
}