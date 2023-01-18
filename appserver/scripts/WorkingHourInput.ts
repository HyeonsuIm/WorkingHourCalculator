function MakeSplitStr(str)
{
    let result = ""
    for(let i=1;i<str.length;i++)
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
    let workingHourInputElement = <HTMLInputElement>document.getElementById("working_hour_input")
    let multiStr = workingHourInputElement.value
    let strs = multiStr.split("\n")
    if( strs.length < 2 )
    {
        return
    }

    let headers = strs[0].split("\t")
    let working_hour_map = {}
    for(let strIdx=1;strIdx<strs.length;strIdx++ )
    {
        let contents = MakeSplitStr(strs[strIdx]).split(";")
        let startDate = contents[19]
        let yearMonthDay = startDate.split('-')
        const WORKING_HOUR_START_IDX = 20
        for(let contentIdx=0;contentIdx<7;contentIdx++)
        {
            let date = new Date(2000+Number(yearMonthDay[0]), Number(yearMonthDay[1])-1, Number(yearMonthDay[2]) + contentIdx)
            let key = String(date.getFullYear()) + "-" + String(date.getMonth()+1).padStart(2,"0")
            if( false == working_hour_map.hasOwnProperty(key) )
            {
                working_hour_map[key] = []
            }
            
            let times = contents[contentIdx+WORKING_HOUR_START_IDX].split(':')
            let minute = 0;
            if( times.length == 2 )
            {
                minute = parseInt(times[0])*60 + parseInt(times[1])
            }
            working_hour_map[key].push([date.getDate(), minute])
        }
    }
    UpdateWorkingHours(working_hour_map, null)
    // var toastTrigger = document.getElementById('enter_working_hours')
    // if (toastTrigger) 
    // {
    //     var toastLiveExample = document.getElementById('liveToast')
    //     var toast = new bootstrap.Toast(toastLiveExample)
    //     toast.show()
    // }

    //location.href='/'
}