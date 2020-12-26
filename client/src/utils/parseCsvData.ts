import { csvParse } from "d3"

export type CsvDataType = {
  Country: string,
  "Device Type": string,
  Duration: string,
  "Duration (s)": number,
  "Movie ID": string,
  Timestamp: Date,
  Title: string,
  "Top Node ID": string,
  Type: string,
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
        "Duration (s)": parseInt(rawRow["Duration (s)"] || "0"),
        Timestamp: new Date(rawRow.Timestamp || new Date()),
      })
    }

    return rows
  }
  else {
    throw new Error("No data")
  }
}
