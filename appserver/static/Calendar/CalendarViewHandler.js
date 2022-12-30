displayDateYear = 2022
displayDateMonth = 1
displayDateDay = 1

function displayModal(element) {
    var keyVal = element.getAttribute('data-id');

    year_month_day = keyVal.split('-')
    let workingHours = GetWorkingHour(year_month_day[0], year_month_day[1])
    $(".modal-body #keyVal").val(keyVal)

    let working_hour_element = $("#work_hour_day")
    day = Number(year_month_day[2])
    if(workingHours[day]){
        str = String(Math.floor(workingHours[day] / 60)) + ":" + String(workingHours[day] % 60).padStart(2,'0')
        working_hour_element.val(str)
    }
    else{
        working_hour_element.val("")
        working_hour_element.attr('placeholder', '10:00')
    }
    $('#day_modal').modal('show')
}

function UpdateGlobalDateInformation() {
    overtime_work = 0
    working_hour_plan = 0
    today = new Date()

    displayDateYear = today.getFullYear()
    displayDateMonth = today.getMonth()
    displayDateDay = today.getDate()

    //UpdateLeaveWorkTime()
    restoreSelectBase()
    UpdateRemainWorkingHour()
    RequestHolidays(displayDateYear)
    RequestWorkingInfos(String(displayDateYear)+"-"+String(displayDateMonth+1).padStart(2,"0"))
}

function UpdateAllViews() {
    updateWorkingPlan()
    UpdateOvernightPayHour()
    updateWorkingOverpayPlan();

    render_calendar(displayDateYear, displayDateMonth, displayDateDay)
    render_working_hour(displayDateYear, displayDateMonth, displayDateDay)
    render_calculated_working_hour(today.getFullYear(), today.getMonth(), today.getDate())
    renderOvernightPay()
}

function UpdateDayInformationFromPopup() {
    let keyVal = document.getElementById("keyVal").value
    let working_hour = document.getElementById('work_hour_day').value
    if (document.getElementById("full_day").checked) {
        UpdateDayInfo(keyVal, 1)
    }
    else if (document.getElementById("half_day").checked) {
        UpdateDayInfo(keyVal, 2)
    }
    else {
        UpdateDayInfo(keyVal, 0)
    }
    
    if(working_hour != '')
    {
        let times = working_hour.split(':')
        let minute = 0;
        if( times.length == 2 )
        {
            minute = times[0]*60 + times[1]*1
        }
        year_month_day = keyVal.split('-')

        key = year_month_day[0] + "-" + year_month_day[1].padStart(2,"0")
        working_hour_dict = {}
        working_hour_dict[key]=[[Number(year_month_day[2]), minute]]
        UpdateWorkingHours(working_hour_dict, key)
    }
}