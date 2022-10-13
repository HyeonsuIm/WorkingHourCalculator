function displayModal(element) {
    var keyVal = element.getAttribute('data-id');
    $(".modal-body #keyVal").val(keyVal)
    $('.modal').modal('show');
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
    let element = document.getElementById("keyVal")
    keyVal = element.value

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