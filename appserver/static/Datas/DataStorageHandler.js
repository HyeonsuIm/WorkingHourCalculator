holidayList=[]
vacationList=[]
half_vacationList = []

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
    }catch(error){
        console.log(error);
    }
    UpdateAllViews()
}

async function UpdateVacations(year_month_day, type)
{
    var getCookie = function(name) {
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value? value[2] : null;
    };

    member_id = getCookie('member_id')
    if(member_id==null)
    {        
        for( let key in localStorage )
        {
            vacationType = localStorage.getItem(key)
            if( 1 == vacationType )
            {
                //let [year, month,day] = key.split('-',3)
                vacationList.push(key)
            }
            else if( 2 == vacationType)
            {
                half_vacationList.push(key)
            }
        }
    }
    else
    {
        try{
            const response = await axios.post('/api/request/vacations',{
                params:{
                    memberId:member_id,
                    year:year
                }
            });
            console.log(response);
            vacationList = response.data['vacations']
            half_vacationList = response.data['half_vacations']
        }catch(error){
            console.log(error);
        }
    }
    UpdateAllViews()
}

async function RequestVacations(year, member_id)
{
    if(member_id==null)
    {        
        for( let key in localStorage )
        {
            vacationType = localStorage.getItem(key)
            if( 1 == vacationType )
            {
                //let [year, month,day] = key.split('-',3)
                vacationList.push(key)
            }
            else if( 2 == vacationType)
            {
                half_vacationList.push(key)
            }
        }
    }
    else
    {
        try{
            const response = await axios.post('/api/request/vacations');
            console.log(response);
            vacationList = response.data['vacations']
            half_vacationList = response.data['half_vacations']
        }catch(error){
            console.log(error);
        }
    }
    UpdateAllViews()
}