import getImgSrcFromTmdbPath from "utils/getImgSrcFromTmdbPath"
import getTmdbSearchTv from "utils/getTmdbSearchTv"
import getTmdbTvDetails from "utils/getTmdbTvDetails"
import indexOfMultiple from "utils/indexOfMultiple"
import postBatchTvDetails from "utils/postBatchTvDetails"
import { CsvDataType } from "utils/parseCsvData"
import { YEAR } from "consts"

export type ConsolidatedTmdbTvType = {
  backdrop_path: string,
  episode_run_time: number[],
  genres: {id:number, name: string}[],
  id: number,
  poster_path: string,
  processedDuration: number,
}

type NameDataType = {consolidatedTvData: ConsolidatedTmdbTvType, count: number, titles: Map<string, number>}
type NameMapType = Map<string,NameDataType>
export type TitleYearMapType = Map<number, {
  [typeKey:string]: NameMapType,
}>

const EMPTY_TMDB_TV_DATA:ConsolidatedTmdbTvType = {
  backdrop_path: "",
  episode_run_time: [], //array of run times returned from TMDB
  genres: [],
  id: -1,
  poster_path: "",
  processedDuration: 42, //in minutes
}

export default async function processCsvData(rows: CsvDataType[]) {
  const titleYearMap:TitleYearMapType = new Map()

  //for each row
  for(let rowIndex=0; rowIndex<rows.length; ++rowIndex) {
    const row = rows[rowIndex]

    const year = row.Date.getFullYear() //get the year
    if(!titleYearMap.has(year)) { //if we are encountering this year for the first time
      titleYearMap.set(year, { //initialize a value in the map for this year
        serie: new Map<string,NameDataType>(),
        movie: new Map<string,NameDataType>(),
      })
    }

    const yearData = titleYearMap.get(year) //get the value for this year
    if(yearData) { //keep typescript happy
      const { typeKey, nameKey } = getKeysFromTitle(row.Title)
      if(yearData[typeKey]) { //keep typescript happy
        if(!yearData[typeKey].has(nameKey)) { //if we are encountering this nameKey for the first time
          yearData[typeKey].set(nameKey, { //initialize an empty value
            consolidatedTvData: {...EMPTY_TMDB_TV_DATA},
            count: 0,
            titles: new Map<string, number>(),
          })
        }
        //else we've already seen this nameKey
      }
    }
  }


  const titles:string[] = Array.from( titleYearMap.get(YEAR)?.serie?.keys() || [] ) //get the titles in this year
  const postData = await postBatchTvDetails(titles).then(response => response.json())
  console.log("postData",postData)

  //for each row
  let lastNameKey = ""
  let multiplier = 1
  for(let rowIndex=0; rowIndex<rows.length; ++rowIndex) {
    const row = rows[rowIndex]

    const year = row.Date.getFullYear() //get the year
    const yearData = titleYearMap.get(year) //get the value for this year
    if(yearData) { //keep typescript happy
      const { typeKey, nameKey } = getKeysFromTitle(row.Title)
      const yearType = yearData[typeKey]
      if(yearType) { //keep typescript happy
        if(lastNameKey === nameKey) { //if this is the same name key
          multiplier *= 1.1 //keep the streak going
        }
        else {
          multiplier = 1
        }

        const titleMap = yearType.get(nameKey)
        updateTitleData(multiplier, row.Title, titleMap)
      }

      lastNameKey = nameKey
    }
  }

  return titleYearMap
}


function getKeysFromTitle(title:string) {
  //try to determine if this is a tv series
  const index = indexOfMultiple(
    title,
    [": Season",": Volume",": Series",": Collection", ":"], //see if the title contains any of these substrings
  )

  return {
    typeKey: index === -1 ? "movie" : "serie",
    nameKey: index === -1 ? title : title.slice(0, index), //this could be a movie name or tv show name
  }
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
