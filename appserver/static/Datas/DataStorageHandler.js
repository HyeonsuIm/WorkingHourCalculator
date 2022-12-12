holidayList=[]
working_hours=[]
vacationList=[]
half_vacationList = []

var getCookie = function(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
};

async function RequestHolidays(year)
{
    try{
        const response = await axios.get('/api/request/holidays',{
            params:{
                year:year
            }
        });
        console.log(response);
        holidayList = response.data['holidays']
        UpdateAllViews()
    }catch(error){
        console.log(error);
    }
}

async function UpdateVacations(year_month_day, type)
{
    member_id = getCookie('member_id')
    let [year, month, day] = year_month_day.split('-',3)
    if(member_id==null)
    {        
        const vacationKey = "vacation:"+String(year)+"-"+String(month).padStart(2,"0")
        let datas = localStorage.getItem(vacationKey)
        if( null === datas)
        {
            datas = Array.from({length:32},()=>0)
        }
        else
        {
            datas = JSON.parse(datas)
        }
        datas[Number(day)] = type;
        localStorage.removeItem(vacationKey)
        localStorage.setItem(vacationKey, JSON.stringify(datas))
    }
    else
    {
        try{
            const response = await axios.post('/api/request/update_vacation',
            {
            },
            {
                params:{
                    year:year,
                    month:month,
                    day:day,
                    type:type
                }
            });
            console.log(response);
            RequestWorkingInfos(String(year)+"-"+String(month).padStart(0,"2"))
        }catch(error){
            console.log(error);
        }
    }
}

async function UpdateWorkingHours(working_hour_map)
{
    member_id = getCookie('member_id')
    if(member_id==null)
    {
        for(let key in working_hour_map)
        {
            const workingHourKey = "WorkingHour:"+key
            let datas = localStorage.getItem(workingHourKey)
            if( null === datas)
            {
                datas = Array.from({length:32},()=>0)
            }
            else
            {
                datas = JSON.parse(datas)
            }
            for(let data in working_hour_map[key])
            {
                datas[data[0]] = data[1];
            }
            localStorage.removeItem(workingHourKey)
            localStorage.setItem(workingHourKey, JSON.stringify(datas))
        }
        
    }
    else
    {
        try{
            const response = await axios.post('/api/request/set_working_hours',
            {
            },
            {
                params:{
                    map:JSON.stringify(working_hour_map)
                }
            });
            console.log(response);
        }catch(error){
            console.log(error);
        }
    }
}

async function RequestWorkingInfos(year_month)
{
    member_id = getCookie('member_id')
    let [year, month] = year_month.split('-',2)
    vacationList = []
    half_vacationList = []
    if(member_id==null)
    {
        const vacationKey = "vacation:"+year_month
        if(datas = localStorage.getItem(vacationKey))
        {
            vacations = JSON.parse(datas)
            for(i=0;i<32;i++)
            {
                if( 1 == vacations[i] )
                {
                    vacationList.push(year_month+"-"+String(i).padStart(2,"0"))
                }
                else if( 2 == vacations[i])
                {
                    half_vacationList.push(year_month+"-"+String(i).padStart(2,"0"))
                }
            }
        }

        const workingHourKey = "WorkingHour:"+String(year)+"-"+ String(month).padStart(2,'0')
        datas = localStorage.getItem(workingHourKey)
        if( null === datas)
        {
            working_hours = Array.from({length:32},()=>0)
        }
        else
        {
            working_hours = JSON.parse(datas)
        }
    }
    else
    {
        try{
            const response = await axios.post('/api/request/get_working_info',
            {
            },
            {
                params:{
                    year:year,
                    month:month,
                }
            });
            console.log(response);

            if(response.data['working_days'].length)
            {
                for(i=0;i<32;i++)
                {
                    if( response.data['working_days'][i] == 1)
                    {
                        vacationList.push(String(year)+"-"+String(month).padStart(2,"0")+"-"+String(i).padStart(2,"0"))
                    }
                    else if( response.data['working_days'][i] == 2)
                    {
                        half_vacationList.push(String(year)+"-"+String(month).padStart(2,"0")+"-"+String(i).padStart(2,"0"))
                    }
                }
            }

            if(response.data['working_hours'].length)
            {
                working_hours = response.data['working_hours']
            }
            else
            {
                working_hours = Array.from({length:32},()=>0)
            }
            UpdateAllViews()
        }catch(error){
            console.log(error);
        }
    }
    UpdateAllViews()
}

function UpdateAllLocalStorage()
{
    const oldKeyReg = /\d{4}-\d{2}-\d{2}/
    removeKeyList = []
    for( let key in localStorage )
    {
        if(oldKeyReg.test(key))
        {
            vacationType = localStorage.getItem(key)
            UpdateVacations(key, Number(vacationType))
            removeKeyList.push(key)
        }
    }

    for( index=0;index<removeKeyList.length;index++)
    {
        localStorage.removeItem(removeKeyList[index])
    }
}