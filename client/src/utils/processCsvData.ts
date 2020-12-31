import indexOfMultiple from "utils/indexOfMultiple"
import { CsvDataType } from "utils/parseCsvData"

type NameDataType = {count: number, titles: Map<string, number>}
type NameMapType = Map<string,NameDataType>
export type TitleYearMapType = Map<number, {
  [typeKey:string]: NameMapType,
}>

export default function processCsvData(rows: CsvDataType[]) {
  const titleYearMap:TitleYearMapType = new Map()

  let multiplier = 1

  //for each row
  rows.forEach(row => {
    const year = row.Date.getFullYear() //get the year
    if(!titleYearMap.has(year)) { //if we are encountering this year for the first time
      titleYearMap.set(year, { //initialize a value in the map for this year
        serie: new Map<string,NameDataType>(),
        movie: new Map<string,NameDataType>(),
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
      const nameKey = index === -1 ? row.Title : row.Title.slice(0, index) //this could be a movie name or tv show name
      if(yearData[typeKey]) { //keep typescript happy
        if(!yearData[typeKey].has(nameKey)) { //if we are encountering this name for the first time
          multiplier = 1
          yearData[typeKey].set(nameKey, { //initialize a value
            count: 0,
            titles: new Map<string, number>(),
          })
        }
        else {
          multiplier *= 1.1
        }

        const titleMap = yearData[typeKey].get(nameKey)
        updateTitleData(multiplier, row.Title, titleMap)
      }
    }
  })

  return titleYearMap
}

function updateTitleData(
  multiplier: number,
  title: string,
  titleData?: NameDataType,
) {
  if(titleData) { //keep typescript happy
    const titleCount = titleData.titles.get(title)
    if(titleCount === undefined) { //if we're seeing this title for the first time
      titleData.titles.set(title, 1)
      titleData.count += multiplier
    }
    else { //else we've seen this title before
      titleData.titles.set(title, titleCount + 1)
      titleData.count += multiplier * 1.5 //repeated viewings count for more
    }
  }
}
