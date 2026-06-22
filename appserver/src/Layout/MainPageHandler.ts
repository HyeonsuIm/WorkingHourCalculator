import { Modal } from 'bootstrap'
import { UpdateAllViews } from '../Calendar/CalendarViewHandler'

export function displayLoginPopup(message: string) {
    let bodyElement = document.getElementById("signin_result_body")
    if (bodyElement) bodyElement.innerHTML = '<p>' + message + '</p>'

    const modalEl = document.getElementById('signin_result_modal')!
    Modal.getOrCreateInstance(modalEl).show()
}

export function setElementVisibility(isCurrentMonth: boolean) {
    let displayElements = document.querySelectorAll('.input_base_data_row,.only_current_month')
    for (let index = 0; index < displayElements.length; index++) {
        let htmlElement = displayElements[index] as HTMLElement
        htmlElement.style.display = ""
    }

    restoreSelectBase()
    let display = false
    if (isCurrentMonth) {
        display = true
    }
    let removeElements = document.getElementsByClassName('only_current_month')
    for (let index = 0; index < removeElements.length; index++) {
        if (!display) {
            let htmlElement = displayElements[index] as HTMLElement
            htmlElement.style.display = "none"
        }
    }
}

export function setBaseSelect() {
    let result = getSelectBaseInput()
    backupSelectBase(result)
    UpdateAllViews()
}

export function getSelectBaseInput(): string {
    let elements = document.getElementsByName("select_base")
    let result = ""

    for (let index = 0; index < elements.length; index++) {
        let htmlElement = elements[index] as HTMLInputElement
        if (htmlElement.checked) {
            result = htmlElement.value
            break
        }
    }

    return result
}

export function updateBaseSelectView(result: string) {
    let display = false
    if (result == "input") {
        let checkboxElement = document.getElementById('select_base_input') as HTMLInputElement
        if (checkboxElement) checkboxElement.checked = true
        display = true
    } else if (result == "calendar") {
        let checkboxElement = document.getElementById('select_base_calendar') as HTMLInputElement
        if (checkboxElement) checkboxElement.checked = true
    }

    let elements = document.getElementsByClassName('input_base_data_row')
    for (let index = 0; index < elements.length; index++) {
        if (!display) {
            let htmlElement = elements[index] as HTMLElement
            htmlElement.style.display = "none"
        }
    }
}

export function restoreSelectBase() {
    let result = getSelectBase()
    updateBaseSelectView(result)
}

export function getSelectBase(): string {
    const key = "select_type"
    let result = localStorage.getItem(key)
    if (result === null) {
        result = "calendar"
    }
    return result
}

export function backupSelectBase(result: string) {
    const key = "select_type"
    localStorage.setItem(key, result)
}
