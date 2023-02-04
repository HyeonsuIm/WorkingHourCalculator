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
    if (userId !== null && passwd !== null && re_passwd !== null) {
        if (userId.value == "" || passwd.value == "" || re_passwd.value == "") {
            alert("Name must be filled out");
            return false;
        }
        else if (passwd.value != re_passwd.value) {
            alert("password is wrong");
            return false;
        }
    }
    else {
        alert("error");
    }
    return true;
}
