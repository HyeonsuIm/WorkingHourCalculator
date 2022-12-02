function UpdateLoginContent()
{
    let loginElement = document.getElementById("user_login")
    if(IsLogedin())
    {
        loginElement.innerHTML = GetUserName()
    }
    else
    {
        loginElement.innerHTML = '<a id="work_input" href="Login.html">로그인</a>'
    }
}

function displayLoginPopup(string) {
    let bodyElement = document.getElementById("signin_result_body")
    bodyElement.innerHTML = '<p>' + string + '</p>'

    $('#signin_result_modal').modal('show')
}