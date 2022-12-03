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

function UpdateGlobalDateInformation(holidayListParam) {
    overtime_work = 0
    working_hour_plan = 0
    today = new Date()
    displayDateYear = today.getFullYear()
    displayDateMonth = today.getMonth()
    displayDateDay = today.getDate()
    holidayList = holidayListParam

    holidayList.push("2022-03-09")
    holidayList.push("2022-06-01")
    holidayList.push("2022-08-01")
    holidayList.push("2022-08-02")
    holidayList.push("2022-08-03")
    holidayList.sort()
    vacationList = []
    half_vacationList = []

    UpdateLeaveWorkTime()
    UpdateRemainWorkingHour()
}
function UpdateAllViews() {
    UpdateAllVacation()
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
    if(working_hour != '')
    {
        let times = working_hour.split(':')
        let minute = 0;
        if( times.length == 2 )
        {
            minute = times[0]*60 + times[1]*1
        }
        year_month_day = keyVal.split('-')
        updateWorkingHour(Number(year_month_day[0]), Number(year_month_day[1]), Number(year_month_day[2]), minute)
        UpdateAllViews()
    }

    if (document.getElementById("full_day").checked) {
        UpdateDayInfo(keyVal, 'full_day')
    }
    else if (document.getElementById("half_day").checked) {
        UpdateDayInfo(keyVal, 'half_day')
    }
    else {
        UpdateDayInfo(keyVal, 'working_day')
    }
}