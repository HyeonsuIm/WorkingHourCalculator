import { UpdateWorkingHours } from './Datas/DataStorageHandler'

export function inputWorkingHours() {
    let workingHourInputElement = document.getElementById("working_hour_input") as HTMLInputElement
    let multiStr = workingHourInputElement.value
    let strs = multiStr.split("\n")
    if (strs.length < 2) {
        return
    }

    let headers = strs[0].split('\t')
    let working_hour_map: any = {}
    for (let strIdx = 1; strIdx < strs.length; strIdx++) {
        let contents = strs[strIdx].split('\t')
        const dateRegex = /^\d{2}-\d{2}-\d{2}$/;
        const dateIndices = contents.reduce((acc: number[], cur, idx) => {
            if (dateRegex.test(cur)) acc.push(idx);
            return acc;
        }, []);

        const secondDateIdx = dateIndices.length >= 2 ? dateIndices[1] : 19;
        const dateIndex = contents.findIndex(item => dateRegex.test(item));
        let startDate = contents[secondDateIdx]
        let yearMonthDay = startDate.split('-')
        let WORKING_HOUR_START_IDX = secondDateIdx + 1
        for (let contentIdx = 0; contentIdx < 7; contentIdx++) {
            let date = new Date(2000 + Number(yearMonthDay[0]), Number(yearMonthDay[1]) - 1, Number(yearMonthDay[2]) + contentIdx)
            let key = String(date.getFullYear()) + "-" + String(date.getMonth() + 1).padStart(2, "0")
            if (false == working_hour_map.hasOwnProperty(key)) {
                working_hour_map[key] = []
            }

            let timeStr = contents[contentIdx + WORKING_HOUR_START_IDX]
            let minute = 0
            if (timeStr.includes(':')) {
                let times = timeStr.split(':')
                minute = parseInt(times[0]) * 60 + parseInt(times[1])
            } else {
                minute = parseInt(timeStr) * 60
            }
            working_hour_map[key].push([date.getDate(), minute])
        }
    }
    UpdateWorkingHours(working_hour_map, null)
}
