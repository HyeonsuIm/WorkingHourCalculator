import * as DataStorageHandler from '../Datas/DataStorageHandler.js'
import * as WorkingHourHandler from './WorkingHour.js'
import * as MainPageHandler from '../Layout/MainPageHandler.js'
import * as CalendarAPI from './CalendarAPI.js'
import * as Calendar from './Calendar.js'
import * as $ from 'jquery'


let displayDateYear = 2022
let displayDateMonth = 1
let displayDateDay = 1

function displayModal(element) {
    var keyVal = element.getAttribute('data-id');

    let year_month_day = keyVal.split('-')
    let workingHours = DataStorageHandler.GetWorkingHour()
    $(".modal-body #keyVal").val(keyVal)

    const date = new Date(year_month_day[0], Number(year_month_day[1])-1, year_month_day[2])
    let is_woring_day=false
    if(CalendarAPI.IsCommonWorkingDay(year_month_day[0], year_month_day[1], year_month_day[2], date.getDay())) is_woring_day=true

    let working_day_elements = document.getElementsByClassName('only_working_day')
    for(let index=0;index<working_day_elements.length;index++)
    {
        let htmlElement = <HTMLElement>working_day_elements[index]
        if(is_woring_day) htmlElement.style.display=""
        else htmlElement.style.display="none"
    }

    let holiday_elements = document.getElementsByClassName('only_holiday')
    for(let index=0;index<holiday_elements.length;index++)
    {
        let htmlElement = <HTMLElement>holiday_elements[index]
        if(is_woring_day) htmlElement.style.display="none"
        else htmlElement.style.display=""
    }
    if(is_woring_day)
    {
        let workingDayElement = document.getElementById('working_day') as HTMLInputElement
        workingDayElement.checked=true
    }
    else
    {
        let holidayElement = document.getElementById('holiday') as HTMLInputElement 
        holidayElement.checked=true
    } 


    let working_hour_element = $("#work_hour_day")
    let day = Number(year_month_day[2])
    if(workingHours[day]){
        let str = String(Math.floor(workingHours[day] / 60)) + ":" + String(workingHours[day] % 60).padStart(2,'0')
        working_hour_element.val(str)
    }
    else{
        working_hour_element.val("")
        working_hour_element.attr('placeholder', '10:00')
    }
    $('#day_modal').modal('show')
}

export function UpdateGlobalDateInformation() {
    var today = new Date()

    displayDateYear = today.getFullYear()
    displayDateMonth = today.getMonth()
    displayDateDay = today.getDate()

    WorkingHourHandler.UpdateLeaveWorkTime()
    MainPageHandler.restoreSelectBase()
    WorkingHourHandler.UpdateRemainWorkingHour()
    DataStorageHandler.RequestHolidays(displayDateYear)
    DataStorageHandler.RequestWorkingInfos(String(displayDateYear)+"-"+String(displayDateMonth+1).padStart(2,"0"))
}

export function UpdateAllViews() {
    let today = new Date()
    let isCurrentMonth = false
    if(displayDateYear == today.getFullYear() && displayDateMonth == today.getMonth())
        isCurrentMonth = true

    WorkingHourHandler.updateWorkingPlan()
    WorkingHourHandler.UpdateOvernightPayHour()
    WorkingHourHandler.updateWorkingOverpayPlan();

    Calendar.render_calendar(displayDateYear, displayDateMonth, displayDateDay)
    WorkingHourHandler.render_working_hour(displayDateYear, displayDateMonth, displayDateDay)
    WorkingHourHandler.render_calculated_working_hour(displayDateYear, displayDateMonth, displayDateDay, isCurrentMonth)
    MainPageHandler.setElementVisibility(isCurrentMonth)
    WorkingHourHandler.renderOvernightPay()
}

export function UpdateDayInformationFromPopup() {
    let keyValElement = document.getElementById("keyVal") as HTMLInputElement
    let keyVal = keyValElement.value
    let fullDayElement = document.getElementById("full_day") as HTMLInputElement
    let halfDayElement = document.getElementById("half_day") as HTMLInputElement
    let holidayElement = document.getElementById("holiday_working_day") as HTMLInputElement
    if (fullDayElement.checked) {
        Calendar.UpdateDayInfo(keyVal, 1)
    }
    else if (halfDayElement.checked) {
        Calendar.UpdateDayInfo(keyVal, 2)
    }
    else if (holidayElement.checked){
        Calendar.UpdateDayInfo(keyVal, 3)
    }
    else{
        Calendar.UpdateDayInfo(keyVal, 0)
    }
    
    let workingHourElement = document.getElementById('work_hour_day') as HTMLInputElement
    let working_hour = workingHourElement.value
    if(working_hour != '')
    {
        let times = working_hour.split(':')
        let minute = 0;
        if( times.length == 2 )
        {
            minute = parseInt(times[0])*60 + parseInt(times[1])
        }
        let year_month_day = keyVal.split('-')

        let key = year_month_day[0] + "-" + year_month_day[1].padStart(2,"0")
        let working_hour_dict = {}
        working_hour_dict[key]=[[Number(year_month_day[2]), minute]]
        DataStorageHandler.UpdateWorkingHours(working_hour_dict, key)
    }
}

export function GetDisplayDate() : [number, number, number]
{
    return [displayDateYear, displayDateMonth, displayDateDay]
}