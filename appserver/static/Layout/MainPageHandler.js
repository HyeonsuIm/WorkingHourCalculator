function displayLoginPopup(string) {
    let bodyElement = document.getElementById("signin_result_body")
    bodyElement.innerHTML = '<p>' + string + '</p>'

    $('#signin_result_modal').modal('show')
}

function setElementVisibility(isCurrentMonth)
{
    elements = document.querySelectorAll('.input_base_data_row,.only_current_month')
    for(let index=0;index<elements.length;index++)
    {
        elements[index].style.display=""
    }

    restoreSelectBase()
    let display=false
    if(isCurrentMonth)
    {
        display=true
    }
    elements = document.getElementsByClassName('only_current_month')
    for(let index=0;index<elements.length;index++)
    {
        if(!display) elements[index].style.display="none"
    }
}

function setBaseSelect()
{
    result = getSelectBaseInput()
    backupSelectBase(result)
    UpdateAllViews()
}

function getSelectBaseInput()
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

function updateBaseSelectView(result)
{
    let display=false
    if(result=="input")
    {
        document.getElementById('select_base_input').checked=true
        display=true
    }
    else if(result == "calendar")
    {
        document.getElementById('select_base_calendar').checked=true
    }

    elements = document.getElementsByClassName('input_base_data_row')
    for(let index=0;index<elements.length;index++)
    {
        if(!display) elements[index].style.display="none"
    }
}

function restoreSelectBase()
{
    result = getSelectBase()
    updateBaseSelectView(result)
}

function getSelectBase()
{
    const key = "select_type"
    result = localStorage.getItem(key)
    if(result===null)
    {
        result = "input"
    }
    return result
}

function backupSelectBase()
{
    const key = "select_type"
    localStorage.setItem(key, result)
}