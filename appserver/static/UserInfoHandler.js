function IsLogedin() {
    return false;
}
function GetUserName() {
    return "";
}
function validateForm() {
    let userId = document.getElementById('userid');
    let passwd = document.getElementById('password');
    let re_passwd = document.getElementById('re_password');
    if (userId !== null && passwd !== null) {
        let isSignin = false;
        if (re_passwd !== null) {
            isSignin = true;
        }
        if (userId.value == "" || passwd.value == "") {
            alert("Name must be filled out");
            return false;
        }
        else if (true == isSignin &&
            passwd.value != re_passwd.value) {
            alert("password is wrong");
            return false;
        }
    }
    else {
        alert("error");
        return false;
    }
    return true;
}
