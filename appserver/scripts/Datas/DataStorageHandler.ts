let working_hours: number[]=[];
let holidayList: string[]=[];
let vacationList: string[]=[];
let half_vacationList: string[]=[];
let holidayWorkingList: string[]=[];

var getCookie = function(name:string) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
};

async function RequestHolidays(year:number)
{
    try{
        // @ts-expect-error
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

function UpdateLocalVacation(year_month_day:string, type:number)
{
    let idx = vacationList.indexOf(year_month_day)
    if( -1 != idx )
    {
        vacationList.splice(idx, 1)
    }
    idx = half_vacationList.indexOf(year_month_day)
    if( -1 != idx )
    {
        half_vacationList.splice(idx, 1)
    }

    idx = holidayWorkingList.indexOf(year_month_day)
    if( -1 != idx )
    {
        holidayWorkingList.splice(idx, 1)
    }
    
    if( 1 == type )
    {
        vacationList.push(year_month_day)
    }
    else if( 2 == type)
    {
        half_vacationList.push(year_month_day)
    }
    else if( 3== type)
    {
        holidayWorkingList.push(year_month_day)
    }
    UpdateAllViews()
}

async function UpdateVacations(year_month_day:string, type:number)
{
    let member_id = getCookie('member_id')
    let [year, month, day] = year_month_day.split('-',3)
    const key = String(year)+"-"+String(month).padStart(2,"0")
    if(member_id==null)
    {        
        const vacationKey = "vacation:"+key
        let dataStr = localStorage.getItem(vacationKey)
        let datas:number[];
        if( null === dataStr)
        {
            datas = Array.from({length:32},()=>0)
        }
        else
        {
            datas = JSON.parse(dataStr)
        }
        datas[Number(day)] = type;
        localStorage.removeItem(vacationKey)
        localStorage.setItem(vacationKey, JSON.stringify(datas))
        UpdateLocalVacation(year_month_day, type)
    }
    else
    {
        try{
            // @ts-expect-error
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
            UpdateLocalVacation(year_month_day, type)
        }catch(error){
            console.log(error);
        }
    }
}

function UpdateLocalWorkingHour(working_hour_map:string[], year_month:string)
{
    if(year_month in working_hour_map)
    {
        for(let i=0;i<working_hour_map[year_month].length;i++)
        {
            working_hours[working_hour_map[year_month][i][0]] = working_hour_map[year_month][i][1];
        }
    }
    UpdateAllViews()
}

async function UpdateWorkingHours(working_hour_map, year_month:string)
{
    let member_id = getCookie('member_id')
    if(member_id==null)
    {
        for(let key in working_hour_map)
        {
            const workingHourKey = "WorkingHour:"+key
            let dataStr = localStorage.getItem(workingHourKey)
            let datas:number[]
            if( null === dataStr)
            {
                datas = Array.from({length:32},()=>0)
            }
            else
            {
                datas = JSON.parse(dataStr)
            }
            for(let i=0;i<working_hour_map[key].length;i++)
            {
                datas[working_hour_map[key][i][0]] = working_hour_map[key][i][1];
            }
            localStorage.removeItem(workingHourKey)
            localStorage.setItem(workingHourKey, JSON.stringify(datas))
        }
        if( year_month != null)
        {
            UpdateLocalWorkingHour(working_hour_map, year_month)
        }
        else
        {
            location.href='/'
        }
    }
    else
    {
        try{
            // @ts-expect-error
            const response = await axios.post('/api/request/set_working_hours',
            {
            },
            {
                params:{
                    map:JSON.stringify(working_hour_map)
                }
            });
            if( year_month != null)
            {
                UpdateLocalWorkingHour(working_hour_map, year_month)
            }
            else
            {
                location.href='/'
            }
        }catch(error){
            console.log(error);
        }
    }
}

async function RequestWorkingInfos(year_month:string)
{
    let member_id = getCookie('member_id')
    let [year, month] = year_month.split('-',2)
    vacationList = []
    half_vacationList = []
    holidayWorkingList = []
    if(member_id==null)
    {
        const vacationKey = "vacation:"+year_month
        let datas = localStorage.getItem(vacationKey)
        if(datas)
        {
            let work_types = JSON.parse(datas)
            for(let i=0;i<32;i++)
            {
                let date = year_month+"-"+String(i).padStart(2,"0")
                if( 1 == work_types[i] )
                {
                    vacationList.push(date)
                }
                else if( 2 == work_types[i])
                {
                    half_vacationList.push(date)
                }
                else if( 3 == work_types[i])
                {
                    holidayWorkingList.push(date)
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
        UpdateAllViews()
    }
    else
    {
        try{
            // @ts-expect-error
            const response = await axios.post('/api/request/get_working_info',
            {
            },
            {
                params:{
                    year:year,
                    month:month,
                }
            });

            if(response.data['working_days'].length)
            {
                for(let i=0;i<32;i++)
                {
                    let date = String(year)+"-"+String(month).padStart(2,"0")+"-"+String(i).padStart(2,"0")
                    if( response.data['working_days'][i] == 1)
                    {
                        vacationList.push(date)
                    }
                    else if( response.data['working_days'][i] == 2)
                    {
                        half_vacationList.push(date)
                    }
                    else if( response.data['working_days'][i] == 3)
                    {
                        holidayWorkingList.push(date)
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
}

function UpdateAllLocalStorage()
{
    const oldKeyReg = /\d{4}-\d{2}-\d{2}/
    let removeKeyList=[]
    for( let key in localStorage )
    {
        if(oldKeyReg.test(key))
        {
            let vacationType = localStorage.getItem(key)
            UpdateVacations(key, Number(vacationType))
            removeKeyList.push(key)
        }
    }

    for(let index=0;index<removeKeyList.length;index++)
    {
        localStorage.removeItem(removeKeyList[index])
    }
}

function GetWorkingHour() : number[]
{
    return working_hours;
}