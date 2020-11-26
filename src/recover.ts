import { program } from 'commander'
import { createWriteStream, createReadStream, unlinkSync, copyFile } from 'fs'
import { duka_fetch, NetworkErrorCB } from './duka-fetch'
import { createInterface } from 'readline';
import { newUTCDate, fetchLogFileName, recoverLogFileName } from './utils'
import { exit } from 'process';

async function processCsv(logpath: string, dir: string, cb: NetworkErrorCB) {
    const fileStream = createReadStream(logpath);

    const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const [instrument, day] = line.split(',')
        await duka_fetch(instrument, newUTCDate(day), newUTCDate(day), dir, cb)
    }
}

program
    .version('0.0.1')
    .description("A CLI for recover network download error")
    .option('-f, --file <log>', 'Error log file', fetchLogFileName)
    .option('-dir, --directory <path>', 'data')
    .option('-log, --logger <filename>', 'recover logger filename', recoverLogFileName)
    .option('-r, --replace', 'Replace old log file', false)
    .parse(process.argv);

const options = program.opts()

if (options.file === undefined) {
    program.help()
    exit(1)
}

const logger = createWriteStream(options.logger, {
    flags: 'a' // 'a' means appending (old data will be preserved)
})

processCsv(options.file, options.directory,
    (instrument, day) => { logger.write(instrument + ',' + day + '\n') })
    .finally(() => {
        logger.end()
        if (options.replace) {
            copyFile(recoverLogFileName, fetchLogFileName, (err) => {
                console.log(fetchLogFileName + ' was copied to ' + fetchLogFileName);
            });
        }
    });
