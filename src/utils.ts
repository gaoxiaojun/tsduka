export function newUTCDate(ymd:any) {
    const [year, month, day] = ymd.split('-')
    const date = new Date(Date.UTC(year,month-1,day))
    return date
}

export const recoverLogFileName = 'recover_log.txt'
export const fetchLogFileName = 'fetch_log.txt'