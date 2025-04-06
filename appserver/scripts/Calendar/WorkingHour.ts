let overtime_work:number = 0
let working_hour_plan:number = 0
let working_overpay_plan:number = 0;
let today_remain_time_minute:number = 0
let payPerHour:number = 0
let overtime_work_based_current:number = 0
let overtime_work_max:number = 0
let overtime_work_plan:number = 0

function render_working_hour(year:number, month:number, day:number)
{
    const viewYear = year
    const viewMonth = month

    const monthStartDay = new Date(viewYear, viewMonth, 1)
    const monthLastDay = new Date(viewYear, viewMonth+1, 0)
    const startDayOfWeek = monthStartDay.getDay();

    //날짜 생성
    let [totalWorkingDayCnt, ] = GetCommonWorkingDay(monthStartDay, monthLastDay, startDayOfWeek, day)
    let [totalVacationDayCnt, ] = GetVacations(monthStartDay, monthLastDay, day)
    let [maxWorkingHour, minWorkingHour] = GetWorkingHours(monthLastDay.getDate(), totalWorkingDayCnt, totalVacationDayCnt)

    MakeWorkingHourTable(maxWorkingHour, minWorkingHour)
}

function render_calculated_working_hour(year:number, month:number, day:number, isCurrentMonth:boolean)
{
    const viewYear = year
    const viewMonth = month

    const monthStartDay = new Date(viewYear, viewMonth, 1)
    const monthLastDay = new Date(viewYear, viewMonth+1, 0)
    const startDayOfWeek = monthStartDay.getDay();
    
    let [totalCommonWorkingDayCnt, remainedCommonWorkingDayCnt] = GetCommonWorkingDay(monthStartDay, monthLastDay, startDayOfWeek, day)
    let [totalVacationDayCnt, totalRemainedVacationDayCnt] = GetVacations(monthStartDay, monthLastDay, day)
    let [maxWorkingHour, minWorkingHour] = GetWorkingHours(monthLastDay.getDate(), totalCommonWorkingDayCnt, totalVacationDayCnt)
    
    let totalWorkingDayCnt = totalCommonWorkingDayCnt - totalVacationDayCnt
    let remainedWorkingDayCnt = remainedCommonWorkingDayCnt - totalRemainedVacationDayCnt
    let remainWorkingHour = maxWorkingHour
    let dayOfWeek = (startDayOfWeek + day -1) % 7
    if(isCurrentMonth)
    {
        [remainWorkingHour, remainedWorkingDayCnt] = GetRemainedWorkingHour(maxWorkingHour, day, GetWorkingDayVal(year, month+1, day, dayOfWeek), remainedWorkingDayCnt)
    }
    SetAllRemainedWorkingHour(remainedWorkingDayCnt, maxWorkingHour, minWorkingHour, remainWorkingHour)
    
    overtime_work_max = maxWorkingHour - minWorkingHour
    let normal_work_hour = (totalWorkingDayCnt - remainedWorkingDayCnt) * 8
    let normal_remain_work_hour = remainedWorkingDayCnt * 8
    let curr_work_hour = maxWorkingHour - remainWorkingHour
    overtime_work_based_current = curr_work_hour - normal_work_hour
    if( normal_remain_work_hour > remainWorkingHour)
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

function GetWorkingDay(monthStartDay, monthLastDay, startDayOfWeek:number, today_date:number)
{
    let totalDayCnt = monthLastDay.getDate()
    let workingDayCnt = 0
    let workingDayCntAfterToday = 0
    for(let i=1;i<=totalDayCnt;i++)
    {
        let dayOfWeek = (startDayOfWeek + i -1) % 7
        let dayPlusVal = GetWorkingDayVal(monthStartDay.getFullYear(), monthStartDay.getMonth() + 1, i, dayOfWeek)
        workingDayCnt += dayPlusVal;
        if(today_date <= i)
        {
            workingDayCntAfterToday += dayPlusVal;
        }
    }
    return [workingDayCnt, workingDayCntAfterToday]
}

function GetCommonWorkingDay(monthStartDay, monthLastDay, startDayOfWeek:number, today_date:number) : [number, number]
{
    let totalDayCnt = monthLastDay.getDate()
    let workingDayCnt = 0
    let workingDayCntAfterToday = 0
    for(let i=1;i<=totalDayCnt;i++)
    {
        let dayOfWeek = (startDayOfWeek + i -1) % 7
        let dayPlusVal = GetCommonWorkingDayVal(monthStartDay.getFullYear(), monthStartDay.getMonth() + 1, i, dayOfWeek)
        workingDayCnt += dayPlusVal;
        if(today_date <= i)
        {
            workingDayCntAfterToday += dayPlusVal;
        }
    }
    return [workingDayCnt, workingDayCntAfterToday]
}

function GetVacations(monthStartDay, monthLastDay, today_date:number) : [number, number]
{
    let totalDayCnt = monthLastDay.getDate()
    let vacationDayCnt = 0
    let vacationDayCntAfterToday = 0
    for(let i=1;i<=totalDayCnt;i++)
    {
        let dayPlusVal = GetVacationDayVal(monthStartDay.getFullYear(), monthStartDay.getMonth() + 1, i)
        vacationDayCnt += dayPlusVal;
        if(today_date <= i)
        {
            vacationDayCntAfterToday += dayPlusVal;
        }
    }
    return [vacationDayCnt, vacationDayCntAfterToday]
}

function GetWorkingHours(totalDayCnt:number, totalWorkingDayCnt:number, vacationDayCnt:number):[number, number]
{
    let maxWorkingHour = totalDayCnt / 7 * 52;
    let minWorkingHour = Math.min((totalWorkingDayCnt - vacationDayCnt) * 8, totalDayCnt / 7 * 40);
    return [maxWorkingHour, minWorkingHour]
}

function MakeWorkingHourTable(maxWorkingHour:number, minWorkingHour:number)
{
    SetRemainedWorkingHour("month_max_working_hour", maxWorkingHour)
    SetRemainedWorkingHour("month_min_working_hour", minWorkingHour)
}

function SetAllRemainedWorkingHour(workingDayCntAfterToday:number, maxWorkingHour:number, minWorkingHour:number, remainedWorkingHour:number)
{
    let remainedMaxWorkingHour = remainedWorkingHour
    let remainedPlanWorkingHour = remainedWorkingHour - working_hour_plan
    let expectWorkingHour = (( working_overpay_plan / payPerHour ) + minWorkingHour) - (maxWorkingHour - remainedWorkingHour) // 예상남은근무시간 = 근무해야 하는 시간 - 현재까지 근무한 시간
    let remainedMinWorkingHour = minWorkingHour - (maxWorkingHour - remainedMaxWorkingHour)

    if( 0 == workingDayCntAfterToday )
    {
        workingDayCntAfterToday = 1
    }

    SetRemainedWorkingHour("daily_working_hour_plan", remainedPlanWorkingHour / workingDayCntAfterToday)
    SetRemainedWorkingHour("daily_working_hour_max", remainedMaxWorkingHour / workingDayCntAfterToday)
    SetRemainedWorkingHour("daily_working_hour_min", remainedMinWorkingHour / workingDayCntAfterToday)
    SetRemainedWorkingHour("daily_working_hour_overpay_plan", expectWorkingHour / workingDayCntAfterToday)
}

function GetRemainedWorkingHour(maxWorkingHour:number, currentDay:number, currentWorkingDayVal:number, remainWorkingDayCnt:number) : [number, number]
{
    let select = getSelectBase()
    if(select=="input")
    {
        const remainedWorkingHourKey = "remainWorkingHour"
        let remainedWorkingHourLocal = localStorage.getItem(remainedWorkingHourKey)
        if(remainedWorkingHourLocal)
        {
            let remainedWorkingHourArr = JSON.parse(remainedWorkingHourLocal)
            let remainedWorkingHourStr = remainedWorkingHourArr['remain_hour']

            let remainedWorkingHour = 0
            if(remainedWorkingHourStr.indexOf(":") != -1)
            {
                let splitIndex = remainedWorkingHourStr.indexOf(":")
                let hour = parseInt(remainedWorkingHourStr.substr(0, splitIndex))
                let minute = parseInt(remainedWorkingHourStr.substr(splitIndex+1))
                remainedWorkingHour = hour + (minute / 60)
            }
            else
            {
                remainedWorkingHour = parseFloat(remainedWorkingHourStr);
            }
            
            return [remainedWorkingHour - today_remain_time_minute / 60, remainWorkingDayCnt-currentWorkingDayVal];
        }
    }
    else
    {
        let [hasCurrentDay, totalWorkingHour] = GetTotalWorkingHour(maxWorkingHour, currentDay)
        if(hasCurrentDay)
        {
            return [totalWorkingHour, remainWorkingDayCnt-currentWorkingDayVal]
        }
        else
        {
            return [totalWorkingHour, remainWorkingDayCnt]
        }
    }
    return [0,0]
}

function GetTotalWorkingHour(maxWorkingHour:number, currentDay:number) : [ boolean, number ]
{
    let hasCurrentDay = false
    let working_hours = GetWorkingHour()
    let total_miniute = 0
    for(let i=0;i<currentDay;i++)
    {
        total_miniute += working_hours[i]
    }

    if(working_hours[currentDay] != 0)
    {
        hasCurrentDay = true
        total_miniute += working_hours[currentDay]
    }
    return [hasCurrentDay,maxWorkingHour - (total_miniute / 60)]
}

function GetRemainedWorkingStoreTime()
{
    const remainedWorkingHourKey = "remainWorkingHour"
    let data = localStorage.getItem(remainedWorkingHourKey)
    let storeTime = null
    if(data)
    {
        let remainedWorkingHourArr = JSON.parse(data)
        if(remainedWorkingHourArr)
        {
            storeTime = remainedWorkingHourArr['store_time'];
        }
    }
    
    return storeTime
}

function SetRemainedWorkingHour(elementId:string, value:number)
{
    let element = document.getElementById(elementId)
    if(element)
    {
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
}

function updateWorkingPlan()
{
    let workingPlanElement = document.getElementById('working_plan') as HTMLInputElement
    if(workingPlanElement)
    {
        let workingPlan = workingPlanElement.value

        if( "-1" == workingPlan )
        {
            let workingPlan = localStorage.getItem('working_plan')
            if(workingPlan)
            {
                workingPlanElement.value = workingPlan
                workingPlan = workingPlanElement.value
            }
        }
        else
        {
            localStorage.setItem('working_plan', workingPlan)
        }
        
        working_hour_plan = parseInt(workingPlan)
    }
}

function updateWorkingOverpayPlan()
{
    let overpayElement = <HTMLInputElement>document.getElementById('working_overpay')
    if(overpayElement)
    {
        let overpayPlan = overpayElement.value

        if( "-1" == overpayPlan )
        {
            let overpay = localStorage.getItem('working_overpay')
            if(overpay)
            {
                overpayElement.value = overpay
                overpayPlan = overpayElement.value
            }
        }
        else
        {
            localStorage.setItem('working_overpay', overpayPlan)
        }
        
        if( parseFloat(overpayPlan) < 0 )
        {
            overpayPlan = "0"
        }
        working_overpay_plan = parseInt(overpayPlan)
    }
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
    let workingDoneElement = <HTMLInputElement>document.getElementById("working_done")
    let remainedWorkingHour = workingDoneElement.value
    let today = new Date()
    let isSet = false
    if( "" == remainedWorkingHour )
    {
        let remainedWorkingHourLocal = localStorage.getItem(remainedWorkingHourKey)
        if(remainedWorkingHourLocal)
        {
            let storageData = JSON.parse(remainedWorkingHourLocal)
            workingDoneElement.value = storageData['remain_hour']
            remainedWorkingHour = storageData['remain_hour']
            isSet = true
        }
    }

    let isValidValue = true
    if( remainedWorkingHour != "" )
    {
        if( -1 == remainedWorkingHour.indexOf(":"))
        {
            let remainedWorkingFloat = parseFloat(remainedWorkingHour)
            if( isNaN(remainedWorkingFloat))
            {
                isValidValue = false
            }
            else
            {
                let remainedWorkingHour = remainedWorkingFloat.toFixed(0)
                let remainedWorkingMinute = (remainedWorkingFloat - parseInt(remainedWorkingHour)).toFixed(0)
                remainedWorkingHour = remainedWorkingHour + ":" + remainedWorkingMinute
                workingDoneElement.value = remainedWorkingHour
            }
        }
        else
        {
        }
    }
    

    if(isValidValue == false)
    {
        workingDoneElement.style.borderColor="red"
    }
    else
    {
        workingDoneElement.style.borderColor="#ccc"
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
}

function UpdateOvernightPayHour()
{
    let payPerHourElement = document.getElementById("overnight_pay_hour") as HTMLInputElement
    let payPerHourStr = payPerHourElement.value

    if( "" == payPerHourStr )
    {
        let payLocal = localStorage.getItem('overtime_pay')
        if(payLocal)
        {
            payPerHourElement.value = payLocal
            payPerHourStr = payPerHourElement.value
        }
    }
    else
    {
        localStorage.setItem('overtime_pay', payPerHourStr)
    }
    payPerHour = parseInt(payPerHourStr)
}

function renderOvernightPay()
{
    let element = document.getElementById('overtime_work_based_current') as HTMLElement
    if( overtime_work_based_current > 0)
    {
        element.innerText = Math.floor(( overtime_work_based_current * 60 ) * (payPerHour / 60 )).toLocaleString()
    }
    else
    {
        element.innerText = "0"
    }
    
    element = document.getElementById('overnight_pay_max') as HTMLElement
    if( overtime_work_max > 0)
    {
        element.innerText = Math.floor(( overtime_work_max * 60 ) * (payPerHour / 60 )).toLocaleString()
    }
    else
    {
        element.innerText = "0"
    }

    element = document.getElementById('overnight_pay_plan') as HTMLElement
    if( overtime_work_plan > 0)
    {
        element.innerText = Math.floor(( overtime_work_plan * 60 ) * (payPerHour / 60 )).toLocaleString()
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
    let leaveWorkTimeElement = document.getElementById("leave_work_time") as HTMLInputElement
    let leave_time = leaveWorkTimeElement.value
    const leave_time_key = 'leave_work_time'
    if(leave_time == "")
    {
        if( -1 != Object.keys(localStorage).indexOf(leave_time_key) )
        {
            let leaveTimeLocal = localStorage.getItem(leave_time_key)
            if(leaveTimeLocal)
            {
                leaveWorkTimeElement.value = leaveTimeLocal
                leave_time = leaveTimeLocal
            }
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
    let store_time_obj = GetRemainedWorkingStoreTime()
    if( store_time_obj )
    {
        let store_time = new Date()
        if( today.getMonth() == store_time.getMonth() &&
            today.getDate() == store_time.getDate() )
        {
            let lunch_start_time_minute = 12 * 60 + 30
            let lunch_finish_time_minute = 13 * 60 + 30

            let store_time_minute = store_time.getHours() * 60 + store_time.getMinutes()
            let leave_time_minute = parseInt(leave_time.split(':')[0]) * 60 + parseInt(leave_time.split(':')[1])
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
    }
}

function DisplayWorkingHoursModal()
{
    $('.working_hour_modal').modal('show');
}

function GetPayPerHour() : number
{
    return payPerHour
}