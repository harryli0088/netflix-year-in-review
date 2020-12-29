import indexOfMultiple from "utils/indexOfMultiple"
import { CsvDataType } from "utils/parseCsvData"

type TitleDataType = {count: number, titles: Map<string, number>}
type TitleMapType = Map<string,TitleDataType>
export type TitleYearMapType = Map<number, {
  [typeKey:string]: TitleMapType,
}>

export default function processCsvData(rows: CsvDataType[]) {
  const titleYearMap:TitleYearMapType = new Map()

  //for each row
  rows.forEach(row => {
    const year = row.Date.getFullYear() //get the year
    if(!titleYearMap.has(year)) { //if we are encountering this year for the first time
      titleYearMap.set(year, { //initialize a value in the map for this year
        serie: new Map<string,TitleDataType>(),
        movie: new Map<string,TitleDataType>(),
      })
    }

    const yearData = titleYearMap.get(year) //get the value for this year
    if(yearData) { //keep typescript happy
      //try to determine if this is a tv series
      const index = indexOfMultiple(
        row.Title,
        [": Season",": Volume",": Series",": Collection"], //see if the title contains any of these substrings
      )

      const typeKey = index === -1 ? "movie" : "serie"
      const titleKey = index === -1 ? row.Title : row.Title.slice(0, index)
      if(yearData[typeKey]) { //keep typescript happy
        if(!yearData[typeKey].has(titleKey)) { //if we are encountering this show for the first time
          yearData[typeKey].set(titleKey, { //initialize a value
            count: 0,
            titles: new Map<string, number>(),
          })
        }

        const titleMap = yearData[typeKey].get(titleKey)
        updateTitleData(row.Title, titleMap)
      }
    }
  })

  return titleYearMap
}

function updateTitleData(
  title: string,
  titleData?: TitleDataType,
) {
  if(titleData) { //keep typescript happy
    const titleCount = titleData.titles.get(title)
    if(titleCount === undefined) {
      titleData.titles.set(title, 1)
    }
    else {
      titleData.titles.set(title, titleCount + 1)
    }
    titleData.count++
  }
}
