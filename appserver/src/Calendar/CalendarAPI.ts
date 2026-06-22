import { holidayList, vacationList, half_vacationList, holidayWorkingList } from '../Datas/DataStorageHandler'

export function MakeWorkingHourMiniuteString(miniute: number): string {
    if (miniute) { return Math.floor((miniute / 60)) + ":" + String(miniute % 60).padStart(2, '0') }
    else { return "" }
}

export function IsHoliday(year: number, month: number, date: number): boolean {
    let dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(date).padStart(2, '0')
    return -1 != holidayList.indexOf(dateStr)
}

export function IsVacation(year: number, month: number, date: number): boolean {
    let dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(date).padStart(2, '0')
    return -1 != vacationList.indexOf(dateStr)
}

export function IsHalfVacation(year: number, month: number, date: number): boolean {
    let dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(date).padStart(2, '0')
    return -1 != half_vacationList.indexOf(dateStr)
}

export function IsHolidayWorking(year: number, month: number, day: number): boolean {
    let dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0')
    return -1 != holidayWorkingList.indexOf(dateStr)
}

export function GetWorkingDayVal(year: number, month: number, day: number, dayOfWeek: number): number {
    if (IsHolidayWorking(year, month, day)) return 1;
    if (IsHoliday(year, month, day) || IsVacation(year, month, day) || 0 == dayOfWeek || 6 == dayOfWeek) return 0
    if (IsHalfVacation(year, month, day)) return 0.5
    return 1
}

export function GetCommonWorkingDayVal(year: number, month: number, day: number, dayOfWeek: number): number {
    return IsCommonWorkingDay(year, month, day, dayOfWeek) ? 1 : 0
}

export function GetVacationDayVal(year: number, month: number, day: number): number {
    if (IsVacation(year, month, day)) return 1;
    if (IsHalfVacation(year, month, day)) return 0.5;
    return 0;
}

export function IsCommonWorkingDay(year: number, month: number, day: number, dayOfWeek: number): boolean {
    return !IsHoliday(year, month, day) && 0 != dayOfWeek && 6 != dayOfWeek
}
