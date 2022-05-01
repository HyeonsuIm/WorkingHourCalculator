function IsHoliday(holidayList, year, month, date)
{
    dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(date).padStart(2,'0')
    if( -1 != holidayList.indexOf(dateStr) )
    {
        return true
    }
    else
    {
        return false
    }
}

function IsVacation(vacationList, year, month, date)
{
    dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(date).padStart(2,'0')
    if( -1 != vacationList.indexOf(dateStr) )
    {
        return true
    }
    else
    {
        return false
    }
}

function IsWorkingDay(holidayList, vacationList, year, month, day, dayOfWeek)
{
    if ( false == IsHoliday(holidayList, year, month, day) &&
         false == IsVacation(vacationList, year, month, day) &&
         0 != dayOfWeek &&
         6 != dayOfWeek)
    {
        return true
    }
    else
    {
        return false
    }
}