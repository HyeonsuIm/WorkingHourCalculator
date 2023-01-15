import * as CalendarViewAPI from '../Calendar/CalendarViewHandler'
import * as $ from 'jquery'

function displayLoginPopup(string) {
    let bodyElement = document.getElementById("signin_result_body")
    if(bodyElement) bodyElement.innerHTML = '<p>' + string + '</p>'

    $('#signin_result_modal').modal('show')
}

export function setElementVisibility(isCurrentMonth)
{
    let displayElements = document.querySelectorAll('.input_base_data_row,.only_current_month')
    for(let index=0;index<displayElements.length;index++)
    {
        let htmlElement = <HTMLElement>displayElements[index]
        htmlElement.style.display=""
    }

    restoreSelectBase()
    let display=false
    if(isCurrentMonth)
    {
        display=true
    }
    let removeElements = document.getElementsByClassName('only_current_month')
    for(let index=0;index<removeElements.length;index++)
    {
        if(!display)
        {
            let htmlElement = <HTMLElement>displayElements[index]
            htmlElement.style.display="none"
        } 
    }
}

function setBaseSelect()
{
    let result = getSelectBaseInput()
    backupSelectBase(result)
    CalendarViewAPI.UpdateAllViews()
}

function getSelectBaseInput()
{
    let elements = document.getElementsByName("select_base")
    let result = ""

    for(let index=0;index<elements.length;index++)
    {
        let htmlElement = elements[index] as HTMLInputElement
        if(htmlElement.checked)
        {
            result = htmlElement.value
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
        let checkboxElement = document.getElementById('select_base_input') as HTMLInputElement
        checkboxElement.checked=true
        display=true
    }
    else if(result == "calendar")
    {
        let checkboxElement = document.getElementById('select_base_calendar') as HTMLInputElement
        checkboxElement.checked=true
    }

    let elements = document.getElementsByClassName('input_base_data_row')
    for(let index=0;index<elements.length;index++)
    {
        if(!display)
        {
            let htmlElement = elements[index] as HTMLElement
            htmlElement.style.display="none"
        }
    }
}

export function restoreSelectBase()
{
    let result = getSelectBase()
    updateBaseSelectView(result)
}

export function getSelectBase()
{
    const key = "select_type"
    let result = localStorage.getItem(key)
    if(result===null)
    {
        result = "input"
    }
    return result
}

function backupSelectBase(result)
{
    const key = "select_type"
    localStorage.setItem(key, result)
}