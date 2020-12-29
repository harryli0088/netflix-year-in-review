import { csvParse } from "d3"

export type CsvDataType = {
  Date: Date,
  Title: string,
  topNodeId: string,
}

export default function parseCsvData(data:string) {
  if(data) {
    const parsedData = csvParse(data)
    const rows: CsvDataType[] = []
    for(let i=0; i<parsedData.length; ++i) {
      const rawRow = parsedData[i]
      // @ts-ignore
      rows.push({
        ...rawRow,
        Date: new Date(rawRow.Date || new Date()),
        topNodeId: "", //to be filled in later
      })
    }

    return rows
  }
  else {
    throw new Error("No data")
  }
}
