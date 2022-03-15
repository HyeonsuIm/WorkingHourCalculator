function IsHoliday(holidayList, year, month, date)
{
    dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(date).padStart(2,'0')
    if( -1 != holidayList.indexOf(dateStr) )
    {
        return true;
    }
    else
    {
        return false;
    }
}