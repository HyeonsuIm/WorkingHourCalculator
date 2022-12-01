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
    userId = document.getElementById('userid')
    passwd = document.getElementById('password')
    re_passwd = document.getElementById('re_password')

    if( userId == "" || passwd == "" || re_passwd == "" )
    {
        alert("Name must be filled out")
        return false
    }
    else if(passwd.value != re_passwd.value)
    {
        alert("password is wrong")
        return false
    }
    return true;
}