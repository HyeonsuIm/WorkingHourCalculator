function displayLoginPopup(string) {
    let bodyElement = document.getElementById("signin_result_body")
    bodyElement.innerHTML = '<p>' + string + '</p>'

    $('#signin_result_modal').modal('show')
}