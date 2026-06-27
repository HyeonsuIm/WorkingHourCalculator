import { Tooltip, Modal } from 'bootstrap'
import { SetMonth } from './Calendar/Calendar'
import { displayModal, UpdateModalDatas, UpdateGlobalDateInformation, UpdateAllViews, UpdateDayInformationFromPopup } from './Calendar/CalendarViewHandler'
import { setBaseSelect, displayLoginPopup } from './Layout/MainPageHandler'
import { UpdateRemainWorkingHourAndUpdate, UpdateLeaveWorkTimeAndUpdate } from './Calendar/WorkingHour'
import { validateForm } from './UserInfoHandler'
import { inputWorkingHours } from './WorkingHourInput'
import { UpdateAllLocalStorage } from './Datas/DataStorageHandler'

function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
    const icon = document.getElementById('theme-icon')
    if (icon) icon.className = next === 'dark' ? 'fa fa-sun-o' : 'fa fa-moon-o'
}

declare global {
    interface Window {
        SetMonth: (diff: number) => void
        toggleTheme: () => void
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
        _flashMessages?: string[]
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
window.toggleTheme = toggleTheme

document.addEventListener('DOMContentLoaded', function() {
    // Sync theme icon with current theme
    const icon = document.getElementById('theme-icon')
    if (icon) icon.className = document.documentElement.getAttribute('data-theme') === 'dark' ? 'fa fa-sun-o' : 'fa fa-moon-o'

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

// Process flash messages stored before module loaded
if (window._flashMessages) {
    window._flashMessages.forEach(msg => displayLoginPopup(msg))
    window._flashMessages = []
}
