import { Tooltip, Modal } from 'bootstrap'
import { SetMonth } from './Calendar/Calendar'
import { displayModal, UpdateModalDatas, UpdateGlobalDateInformation, UpdateAllViews, UpdateDayInformationFromPopup } from './Calendar/CalendarViewHandler'
import { setBaseSelect, displayLoginPopup } from './Layout/MainPageHandler'
import { UpdateRemainWorkingHourAndUpdate, UpdateLeaveWorkTimeAndUpdate } from './Calendar/WorkingHour'
import { validateForm } from './UserInfoHandler'
import { inputWorkingHours } from './WorkingHourInput'
import { UpdateAllLocalStorage } from './Datas/DataStorageHandler'

declare global {
    interface Window {
        SetMonth: (diff: number) => void
        displayModal: (element: HTMLElement) => void
        setBaseSelect: () => void
        UpdateRemainWorkingHourAndUpdate: () => void
        UpdateLeaveWorkTimeAndUpdate: () => void
        UpdateAllViews: () => void
        UpdateDayInformationFromPopup: () => void
        displayLoginPopup: (message: string) => void
        validateForm: () => boolean
        inputWorkingHours: () => void
        UpdateModalDatas: (keyVal: string) => void
        UpdateGlobalDateInformation: () => void
        UpdateAllLocalStorage: () => void
    }
}

// Expose functions to window for HTML onclick handlers
window.SetMonth = SetMonth
window.displayModal = displayModal
window.setBaseSelect = setBaseSelect
window.UpdateRemainWorkingHourAndUpdate = UpdateRemainWorkingHourAndUpdate
window.UpdateLeaveWorkTimeAndUpdate = UpdateLeaveWorkTimeAndUpdate
window.UpdateAllViews = UpdateAllViews
window.UpdateDayInformationFromPopup = UpdateDayInformationFromPopup
window.displayLoginPopup = displayLoginPopup
window.validateForm = validateForm
window.inputWorkingHours = inputWorkingHours
window.UpdateModalDatas = UpdateModalDatas
window.UpdateGlobalDateInformation = UpdateGlobalDateInformation
window.UpdateAllLocalStorage = UpdateAllLocalStorage

document.addEventListener('DOMContentLoaded', function() {
    // Set up keydown handler for work_hour_day input
    const workHourDayEl = document.getElementById("work_hour_day")
    if (workHourDayEl) {
        workHourDayEl.addEventListener("keydown", function(event: Event) {
            const keyEvent = event as KeyboardEvent
            if (keyEvent.key === "Enter") {
                keyEvent.preventDefault()
                const saveBtn = document.getElementById("save_working_change")
                if (saveBtn) saveBtn.click()
            }
            if (keyEvent.key === "Tab") {
                keyEvent.preventDefault()
                UpdateDayInformationFromPopup()

                const targetIdValue = (document.getElementById("keyVal") as HTMLInputElement).value
                const elements = document.querySelectorAll('#month-day, #month-day-today')

                let targetIndex = -1
                elements.forEach((el, index) => {
                    if ((el as HTMLElement).dataset.id == targetIdValue) {
                        targetIndex = index
                    }
                })

                if (targetIndex !== -1) {
                    if (keyEvent.shiftKey) {
                        targetIndex -= 1
                    } else {
                        targetIndex += 1
                    }
                    const nextElement = elements[targetIndex] || null
                    if (nextElement) {
                        UpdateModalDatas(nextElement.getAttribute('data-id')!)
                    }
                }
            }
        })
    }

    // Set up day_modal shown event to focus work_hour_day
    const dayModalEl = document.getElementById('day_modal')
    if (dayModalEl) {
        dayModalEl.addEventListener('shown.bs.modal', function() {
            const workHourDay = document.getElementById('work_hour_day')
            if (workHourDay) workHourDay.focus()
        })
    }

    // Initialize Bootstrap tooltips
    const tooltipElements = document.querySelectorAll('[data-toggle="tooltip"]')
    tooltipElements.forEach(function(el) {
        new Tooltip(el)
    })
})

// Initialize application
UpdateAllLocalStorage()
UpdateGlobalDateInformation()
UpdateAllViews()
