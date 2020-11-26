import { getHistoricRates, InstrumentType, ArrayTickItem, Timeframe } from 'dukascopy-node'
import { instruments } from './instruments'
import { writeFile } from 'fs/promises'
import { existsSync, mkdirSync} from 'fs'

export type NetworkErrorCB = (instrument: string, day:string) => void;

export function getMinStartDate(inst:string)
{
  const instrument = inst.toLowerCase() as InstrumentType
  const { minStartDate } = instruments[instrument]
  return minStartDate
}

export async function duka_fetch(inst: string, fromUtcDate: Date, toUtcDate: Date, floderPath: string, netErrorCallback: NetworkErrorCB) {
  const instrument = inst.toLowerCase() as InstrumentType
  const minStartDate = getMinStartDate(inst)
  const startDate = new Date(minStartDate)

  startDate.setDate(startDate.getDate() + 1) // actual start day is the day after minStartDay

  const date = fromUtcDate > startDate ? new Date(fromUtcDate) : startDate
  const symbol = instrument.toUpperCase()
  const folderPath = `${floderPath}/${symbol}`

  if (!existsSync(folderPath)) mkdirSync(folderPath, { recursive: true })

  while (date <= toUtcDate) {
    const fromDateFormatted = date.toISOString().slice(0, 10)

    date.setDate(date.getDate() + 1)

    const toDateFormatted = date.toISOString().slice(0, 10)

    const config = {
      instrument,
      dates: {
        from: fromDateFormatted,
        to: toDateFormatted,
      },
      timeframe: Timeframe.tick
    }

    try {
      const data = (await getHistoricRates(config)) as unknown as ArrayTickItem[]

      if (data.length) {
        const filePath = `${folderPath}/${fromDateFormatted}.csv`

        writeFile(filePath, data.map(row => row.join()).join('\n')).then(() =>
          console.log(`[${symbol}] ${fromDateFormatted} ✔`),
        )
      } else {
        console.log(`[${symbol}] ${fromDateFormatted} ❌ (no data)`)
      }
    } catch (err) {
      console.error(`Error: ${fromDateFormatted} ${err}`)
      netErrorCallback(instrument, fromDateFormatted)
    }
  }
}
