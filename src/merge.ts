import { program } from 'commander'
import { createWriteStream, readFileSync, readdirSync, lstatSync } from 'fs'
import { exit } from 'process'

program
    .version('0.0.1')
    .description("A CLI for merge csv files to signal one")
    .option('-dir, --directory <path>', 'Download data save directory', 'data')
    .option('-f, --file <filename>', 'Merged csv file name')
    .parse(process.argv);

const options = program.opts();

if (options.file === undefined || options.directory === undefined) {
    program.help()
    exit(1)
}

// check is directory
const stat = lstatSync(options.directory)
if (stat.isDirectory() !== true) {
    program.help()
    exit(2)
}

const os = createWriteStream(options.file, { flags: 'w' })

const files = readdirSync(options.directory).sort()
console.log('files count:' + files.length)
files.forEach(function (f, index) {
    const filePath = `${options.directory}/${f}`
    const content = readFileSync(filePath)
    os.write(content)
})

os.close()
