function MakeWorkingHourMiniuteString(miniute:number):string
{
    if(miniute) {return Math.floor((miniute / 60)) + ":" + String(miniute % 60).padStart(2,'0')}
    else {return ""}
}

function IsHoliday(year:number, month:number, date:number):boolean
{
    let dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(date).padStart(2,'0')
    if( -1 != holidayList.indexOf(dateStr) )
    {
        return true
    }
    else
    {
        return false
    }
}

function IsVacation(year:number, month:number, date:number):boolean
{
    let dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(date).padStart(2,'0')
    if( -1 != vacationList.indexOf(dateStr) )
    {
        return true
    }
    else
    {
        return false
    }
}

function IsHalfVacation(year:number, month:number, date:number):boolean
{
    let dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(date).padStart(2,'0')
    if( -1 != half_vacationList.indexOf(dateStr) )
    {
        return true
    }
    else
    {
        return false
    }
}

function IsHolidayWorking(year:number, month:number, day:number):boolean
{
    let dateStr = year + '-' + String(month).padStart(2,'0') + '-' + String(day).padStart(2,'0')
    if( -1 != holidayWorkingList.indexOf(dateStr) )
    {
        return true
    }
    else
    {
        return false
    }
}

function GetWorkingDayVal(year:number, month:number, day:number, dayOfWeek:number):number
{
    if(IsHolidayWorking(year, month, day))
    {
        return 1;
    }
    else
    {
        if ( true == IsHoliday(year, month, day) ||
             true == IsVacation(year, month, day) ||
             0 == dayOfWeek ||
             6 == dayOfWeek )
        {
            return 0
        }
        else if( true == IsHalfVacation(year, month, day))
        {
            return 0.5
        }
        else
        {
            return 1
        }
    }
}

function GetCommonWorkingDayVal(year:number, month:number, day:number, dayOfWeek:number):number
{
    if(IsCommonWorkingDay(year, month, day, dayOfWeek))
    {
        return 1;
    }
    else
    {
        return 0
    }
}

function GetVacationDayVal(year:number, month:number, day:number):number
{
    if(true == IsVacation(year, month, day))
    {
        return 1;
    }
    else if(true == IsHalfVacation(year,month,day))
    {
        return 0.5;
    }
    else
    {
        return 0;
    }
}

function IsCommonWorkingDay(year:number, month:number, day:number, dayOfWeek:number):boolean
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