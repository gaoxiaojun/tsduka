import { program } from 'commander'
import { exit } from 'process';
import { createWriteStream } from 'fs'
import { duka_fetch } from './duka-fetch'
import { newUTCDate,fetchLogFileName } from './utils'

export async function main() {
    program
        .version('0.0.1')
        .description("A CLI for download dukascopy historical tick")
        .option('-i, --instrument <instrument>', 'To be download instrument name')
        .option('-from, --date-from <date>', 'From UTC Date, format(yyyy-mm-dd)')
        .option('-to, --date-to <date>', 'To UTC Date, format(yyyy-mm-dd')
        .option('-dir, --directory <path>', 'Download data save directory','data')
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

    await duka_fetch(options.instrument, dateFrom, dateTo, options.directory,
        (inst: string, date: string) => { logger.write(inst + ',' + date + '\n') })

    logger.end()
}

main().then(() => console.log('download successful'))