function IsLogedin()
{
    return false
}

function GetUserName()
{
    return ""
}

function validateForm()
{
    let userId = <HTMLInputElement>document.getElementById('userid')
    let passwd = <HTMLInputElement>document.getElementById('password')
    let re_passwd = <HTMLInputElement>document.getElementById('re_password')

    if(userId && passwd && re_passwd)
    {
        if( userId.value == "" || passwd.value == "" || re_passwd.value == "" )
        {
            alert("Name must be filled out")
            return false
        }
        else if(passwd.value != re_passwd.value)
        {
            alert("password is wrong")
            return false
        }
    }
    else
    {
        alert("error")
    }
    return true;
}