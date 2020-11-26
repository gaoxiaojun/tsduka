import { program } from 'commander'
import { createWriteStream, readdirSync, lstatSync } from 'fs'
import { duka_fetch, NetworkErrorCB } from './duka-fetch'
import { newUTCDate, fetchLogFileName } from './utils'

async function download(instruments: string[], dir: string, cb: NetworkErrorCB) {
    for (let inst of instruments) {
        const folderPath = `${options.directory}/${inst}`
        const files = readdirSync(folderPath).sort()
        const last = files.pop()
        let dateFrom = new Date('1900-01-01')
        let dateTo = new Date()
        if (last !== undefined && last.length > 0) {
            const [from,] = last.split('.')
            dateFrom = newUTCDate(from)
            dateFrom.setDate(dateFrom.getDate() + 1)

        }
        await duka_fetch(inst, dateFrom, dateTo, options.directory, cb)
    }
}

program
    .version('0.0.1')
    .description("A CLI for update dukascopy historical tick")
    .option('-dir, --directory <path>', 'Download data save directory', 'data')
    .option('-log, --logger <filename>', 'fetch error logger filename', fetchLogFileName)
    .parse(process.argv);

const options = program.opts();
let instruments: string[] = []
const files = readdirSync(options.directory)
files.forEach(function (inst, index) {
    const folderPath = `${options.directory}/${inst}`
    let stat = lstatSync(folderPath)
    if (stat.isDirectory() === true) {
        instruments.push(inst)
    }
})
console.log(instruments);

const logger = createWriteStream(options.logger, {
    flags: 'a' // 'a' means appending (old data will be preserved)
})

download(instruments, options.directory,
    (inst: string, date: string) => { logger.write(inst + ',' + date + '\n') })
    .finally(() => {
        logger.end()
        console.log('download successful')
    })

