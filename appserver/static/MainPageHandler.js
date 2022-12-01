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

function displayLoginPopup(element, string) {
    var keyVal = element.getAttribute('data-id');
    $('#login_result_body').innerHTML(string)
    $('#login_result').modal('show');
}