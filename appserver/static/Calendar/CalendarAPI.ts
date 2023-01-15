import * as DataStorageAPI from '../Datas/DataStorageHandler'

export function IsHoliday(year, month, date)
{
    let dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(date).padStart(2,'0')
    if( -1 != DataStorageAPI.holidayList.indexOf(dateStr) )
    {
        return true
    }
    else
    {
        return false
    }
}

export function IsVacation(year, month, date)
{
    let dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(date).padStart(2,'0')
    if( -1 != DataStorageAPI.vacationList.indexOf(dateStr) )
    {
        return true
    }
    else
    {
        return false
    }
}

export function IsHalfVacation(year, month, date)
{
    let dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(date).padStart(2,'0')
    if( -1 != DataStorageAPI.half_vacationList.indexOf(dateStr) )
    {
        return true
    }
    else
    {
        return false
    }
}

export function IsHolidayWorking(year, month, day)
{
    let dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(day).padStart(2,'0')
    if( -1 != DataStorageAPI.holidayWorkingList.indexOf(dateStr) )
    {
        return true
    }
    else
    {
        return false
    }
}

export function IsWorkingDay(year, month, day, dayOfWeek)
{
    if(IsHolidayWorking(year, month, day))
    {
        return true;
    }
    else
    {
        if ( false == IsHoliday(year, month, day) &&
         false == IsVacation(year, month, day) &&
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

export function IsCommonWorkingDay(year, month, day, dayOfWeek)
{
    if ( false == IsHoliday(year, month, day) &&
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