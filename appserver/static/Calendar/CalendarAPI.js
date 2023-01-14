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

function IsHolidayWorking(holidayWorkingList, year, month, day)
{
    dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(day).padStart(2,'0')
    if( -1 != holidayWorkingList.indexOf(dateStr) )
    {
        return true
    }
    else
    {
        return false
    }
}

function IsWorkingDay(year, month, day, dayOfWeek)
{
    if(IsHolidayWorking(holidayWorkingList, year, month, day))
    {
        return true;
    }
    else
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
}

function IsCommonWorkingDay(holidayList, year, month, day, dayOfWeek)
{
    if ( false == IsHoliday(holidayList, year, month, day) &&
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