import { csvParse } from "d3"

export type CsvDataType = {
  Date: Date,
  Title: String,
}

export default function parseCsvData(data:string) {
  if(data) {
    const parsedData = csvParse(data)
    const rows: CsvDataType[] = []
    for(let i=0; i<parsedData.length; ++i) {
      const rawRow = parsedData[i]
      // @ts-ignore
      rows.push({
        Title: rawRow.Title,
        Date: new Date(rawRow.Date || new Date()),
      })
    }

    return rows
  }
  else {
    throw new Error("No data")
  }
}
