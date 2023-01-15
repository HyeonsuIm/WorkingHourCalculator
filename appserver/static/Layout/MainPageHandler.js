"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectBase = exports.restoreSelectBase = exports.setElementVisibility = void 0;
const CalendarViewAPI = require("../Calendar/CalendarViewHandler");
const $ = require("jquery");
function displayLoginPopup(string) {
    let bodyElement = document.getElementById("signin_result_body");
    if (bodyElement)
        bodyElement.innerHTML = '<p>' + string + '</p>';
    $('#signin_result_modal').modal('show');
}
function setElementVisibility(isCurrentMonth) {
    let displayElements = document.querySelectorAll('.input_base_data_row,.only_current_month');
    for (let index = 0; index < displayElements.length; index++) {
        let htmlElement = displayElements[index];
        htmlElement.style.display = "";
    }
    restoreSelectBase();
    let display = false;
    if (isCurrentMonth) {
        display = true;
    }
    let removeElements = document.getElementsByClassName('only_current_month');
    for (let index = 0; index < removeElements.length; index++) {
        if (!display) {
            let htmlElement = displayElements[index];
            htmlElement.style.display = "none";
        }
    }
}
exports.setElementVisibility = setElementVisibility;
function setBaseSelect() {
    let result = getSelectBaseInput();
    backupSelectBase(result);
    CalendarViewAPI.UpdateAllViews();
}
function getSelectBaseInput() {
    let elements = document.getElementsByName("select_base");
    let result = "";
    for (let index = 0; index < elements.length; index++) {
        let htmlElement = elements[index];
        if (htmlElement.checked) {
            result = htmlElement.value;
            break;
        }
    }
    return result;
}
function updateBaseSelectView(result) {
    let display = false;
    if (result == "input") {
        let checkboxElement = document.getElementById('select_base_input');
        checkboxElement.checked = true;
        display = true;
    }
    else if (result == "calendar") {
        let checkboxElement = document.getElementById('select_base_calendar');
        checkboxElement.checked = true;
    }
    let elements = document.getElementsByClassName('input_base_data_row');
    for (let index = 0; index < elements.length; index++) {
        if (!display) {
            let htmlElement = elements[index];
            htmlElement.style.display = "none";
        }
    }
}
function restoreSelectBase() {
    let result = getSelectBase();
    updateBaseSelectView(result);
}
exports.restoreSelectBase = restoreSelectBase;
function getSelectBase() {
    const key = "select_type";
    let result = localStorage.getItem(key);
    if (result === null) {
        result = "input";
    }
    return result;
}
exports.getSelectBase = getSelectBase;
function backupSelectBase(result) {
    const key = "select_type";
    localStorage.setItem(key, result);
}
//# sourceMappingURL=MainPageHandler.js.map