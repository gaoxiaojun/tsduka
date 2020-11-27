export function newUTCDate(ymd: any) {
    const [year, month, day] = ymd.split('-')
    const date = new Date(Date.UTC(year, month - 1, day))
    return date
}

export function pad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
}

export function roundNum(value: number, decimal = 4): number {
    return Number(value.toFixed(decimal));
}

export function splitArrayInChunks<T>(array: T[], chunkSize: number): T[][] {
    if (chunkSize >= array.length) {
        return [array];
    }

    let result = [];

    for (let i = 0, n = array.length; i < n; i++) {
        const chunkIndex = Math.floor(i / chunkSize);
        if (!result[chunkIndex]) {
            result[chunkIndex] = [] as T[];
        }

        result[chunkIndex].push(array[i]);
    }

    return result;
}

export const recoverLogFileName = 'recover_log.txt'
export const fetchLogFileName = 'fetch_log.txt'
export const mergeLogFileName = 'merge_log.txt'
export const aggregatorFileName = 'aggregator_log.txt'