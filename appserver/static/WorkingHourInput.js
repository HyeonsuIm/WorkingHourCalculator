function MakeSplitStr(str)
{
    let result = ""
    for(i=1;i<str.length;i++)
    {
        if( str[i-1] != '\t' && str[i] == '\t')
        {
            result += ';'
        }
        else if(str[i-1] == '\t' && str[i] == '\t')
        {
            result+= str[i] + ';'
        }
        else
        {
            result += str[i]
        }
    }
    return result;
}

function inputWorkingHours()
{
    let workingHourInputElement = document.getElementById("working_hour_input")
    let multiStr = workingHourInputElement.value
    let strs = multiStr.split("\n")
    if( strs.Length < 2 )
    {
        return
    }

    let headers = strs[0].split("\t")
    for( strIdx=1;strIdx<strs.length;strIdx++ )
    {
        let contents = MakeSplitStr(strs[strIdx]).split(";")
        let startDate = contents[19]
        yearMonthDay = startDate.split('-')
        const WORKING_HOUR_START_IDX = 20
        for(contentIdx=0;contentIdx<7;contentIdx++)
        {
            let date = new Date(2000+yearMonthDay[0]*1, yearMonthDay[1]-1, yearMonthDay[2]*1 + contentIdx)
            let times = contents[contentIdx+WORKING_HOUR_START_IDX].split(':')
            let minute = 0;
            if( times.length == 2 )
            {
                minute = times[0]*60 + times[1]*1
            }
            updateWorkingHour(date.getFullYear(), date.getMonth()+1, date.getDate(), minute)
        }
    }
    location.href='/'
}

function updateWorkingHour(year, month, day, minute)
{
    const workingHourKey = "WorkingHour:"+String(year)+"-"+ String(month).padStart(2,'0')
    let datas = localStorage.getItem(workingHourKey)
    if( null === datas)
    {
        datas = Array.from({length:32},()=>0)
    }
    else
    {
        datas = JSON.parse(datas)
    }

    datas[day] = minute;
    localStorage.removeItem(workingHourKey)
    localStorage.setItem(workingHourKey, JSON.stringify(datas))
}