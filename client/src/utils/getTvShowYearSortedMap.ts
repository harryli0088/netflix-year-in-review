import { CsvDataType } from "utils/parseCsvData"

type TopNodeIdCountPairType = [string, number]

export type TopNodeIdYearSortedMapType = Map<number, TopNodeIdCountPairType[]>

export default function getTvShowYearSortedMap(rows:CsvDataType[]) {
  const tvShowCounterMap = new Map<string, number>()
  rows.forEach(row => {
    //if this is a TV Series type
    if(row.Type === "Serie") {
      const topNodeId = row["Top Node ID"] //get the top node id
      const key = `${row.Timestamp.getFullYear()}-${topNodeId}`
      if(!tvShowCounterMap.has(key)) { //if we are encountering this top node for the first time
        tvShowCounterMap.set(key, 0) //initialize the counter to 0
      }

      //increment the counter
      tvShowCounterMap.set(
        key,
        (tvShowCounterMap.get(key) || 0) + row["Duration (s)"],
      )
    }
  })

  const tvShowYearSortedMap = new Map<number, TopNodeIdCountPairType[]>()
  tvShowCounterMap.forEach((value:number, key:string) => {
    const split = key.split("-")
    const year = parseInt(split[0])
    const topNodeId = split[1]

    if(!tvShowYearSortedMap.has(year)) { //if we are encountering this year for the first time
      tvShowYearSortedMap.set(year, []) //initialize an empty array
    }

    const topNodeIdsInYear = tvShowYearSortedMap.get(year)
    if(topNodeIdsInYear) {
      topNodeIdsInYear.push([topNodeId, value])
    }
  })

  tvShowYearSortedMap.forEach((topNodeIdsInYear:TopNodeIdCountPairType[], year: number) => {
    topNodeIdsInYear.sort(
      (a:TopNodeIdCountPairType,b:TopNodeIdCountPairType) => {
        if(a[1] < b[1]) return 1
        else if(a[1] > b[1]) return -1
        return 0
      }
    )
  })
  console.log(tvShowYearSortedMap)

  return tvShowYearSortedMap
}
