function displayLoginPopup(string) {
    let bodyElement = document.getElementById("signin_result_body")
    bodyElement.innerHTML = '<p>' + string + '</p>'

    $('#signin_result_modal').modal('show')
}

function setBaseSelect()
{
    result = getSelectBase()
    elements = document.getElementsByClassName('input_base_data_row')
    let display=false
    if(result=="input")
    {
        display=true
    }
    else if(result == "calendar")
    {
    }

    for(let index=0;index<elements.length;index++)
    {
        if(display) elements[index].style.display=""
        else elements[index].style.display="none"
    }
    UpdateAllViews()
}

function getSelectBase()
{
    let elements = document.getElementsByName("select_base")
    result = ""

    for(let index=0;index<elements.length;index++)
    {
        if(elements[index].checked)
        {
            result = elements[index].value
            break
        }
    }

    return result
}