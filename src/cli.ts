import { program } from 'commander'
import { exit } from 'process';
import { createWriteStream } from 'fs'
import { duka_fetch, NetworkErrorCB } from './duka-fetch'
import { newUTCDate, fetchLogFileName } from './utils'

async function download(instruments: string, dateFrom: Date, dateTo: Date, dir: string, cb: NetworkErrorCB) {
    const insts: string[] = options.instrument.split(',')
    for (let inst of insts) {
        await duka_fetch(inst, dateFrom, dateTo, options.directory, cb)
    }
}

program
    .version('0.0.1')
    .description("A CLI for download dukascopy historical tick")
    .option('-i, --instrument <instrument-list>', "To be download instrument-list name, split by ','")
    .option('-from, --date-from <date>', 'From UTC Date, format(yyyy-mm-dd)')
    .option('-to, --date-to <date>', 'To UTC Date, format(yyyy-mm-dd')
    .option('-dir, --directory <path>', 'Download data save directory', 'data')
    .option('-log, --logger <filename>', 'fetch error logger filename', fetchLogFileName)
    .parse(process.argv);

const options = program.opts();
let dateFrom = new Date('1900-01-01')
let dateTo = new Date()

if (options.instrument === undefined) {
    program.help()
    exit(1)
}

if (options.dateFrom !== undefined) {
    dateFrom = newUTCDate(options.dateFrom)
}

if (options.dateTo !== undefined) {
    dateTo = newUTCDate(options.dateTo)
}

const logger = createWriteStream(options.logger, {
    flags: 'a' // 'a' means appending (old data will be preserved)
})

download(options.instrument, dateFrom, dateTo, options.directory,
    (inst: string, date: string) => { logger.write(inst + ',' + date + '\n') })
    .finally(() => {
        logger.end()
        console.log('download successful')
    })
