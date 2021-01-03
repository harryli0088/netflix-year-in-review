import indexOfMultiple from "utils/indexOfMultiple"
import postBatchTvDetails from "utils/postBatchTvDetails"
import { CsvDataType } from "utils/parseCsvData"
import { YEAR } from "consts"

export type ConsolidatedTmdbTvType = {
  backdrop_path: string,
  episode_run_time: number[],
  genres: {id:number, name: string}[],
  id: number,
  original_language: string,
  poster_path: string,
  processedDuration: number,
}

type NameDataType = {consolidatedTvData: ConsolidatedTmdbTvType, score: number, titles: Map<string, number>}
type NameMapType = Map<string,NameDataType>
export type YearDataMapType = Map<number, {
  [typeKey:string]: NameMapType,
}>

const EMPTY_TMDB_TV_DATA:ConsolidatedTmdbTvType = {
  backdrop_path: "",
  episode_run_time: [], //array of run times returned from TMDB
  genres: [],
  id: -1,
  original_language: "",
  poster_path: "",
  processedDuration: 42, //in minutes
}

export default async function processCsvData(rows: CsvDataType[]) {
  const yearTitlesMap = new Map<number, Set<string>>()
  //for each row
  for(let rowIndex=0; rowIndex<rows.length; ++rowIndex) {
    const row = rows[rowIndex]

    const year = row.Date.getFullYear() //get the year
    if(!yearTitlesMap.has(year)) { //if we are encountering this year for the first time
      yearTitlesMap.set(year, new Set<string>())
    }

    const titlesSet = yearTitlesMap.get(year) //get the value for this year
    if(titlesSet) { //keep typescript happy
      const { nameKey } = getKeysFromTitle(row.Title)
      titlesSet.add(nameKey)
    }
  }


  const titles:string[] = Array.from( yearTitlesMap.get(YEAR)?.keys() || [] ) //get the titles in this year
  const postData:{[nameKey:string]:ConsolidatedTmdbTvType} = await postBatchTvDetails(titles).then(
    response => response.json()
  ).then(data => {
    for(const nameKey in data) {
      const nameKeyData = data[nameKey]
      if(nameKeyData.episode_run_time.length) {
        nameKeyData.processedDuration = Math.min(...nameKeyData.episode_run_time)
      }
      else if( //else if this is a K Drama
        nameKeyData.original_language==="ko"
        || nameKeyData.genres.find((g:{id:number, name: string}) => g.name === "Drama")
      ) {
        nameKeyData.processedDuration = 60
      }
      else { //else default to 42 minutes
        nameKeyData.processedDuration = 42
      }
    }
    return data
  })
  console.log("postData",postData)

  //process each row now that we have the API data
  const yearDataMap:YearDataMapType = new Map()
  let lastNameKey = ""
  let multiplier = 1
  for(let rowIndex=0; rowIndex<rows.length; ++rowIndex) {
    const row = rows[rowIndex]

    const year = row.Date.getFullYear() //get the year
    if(!yearDataMap.has(year)) { //if we are encountering this year for the first time
      yearDataMap.set(year, { //initialize a value in the map for this year
        serie: new Map<string,NameDataType>(),
        movie: new Map<string,NameDataType>(),
      })
    }

    const yearData = yearDataMap.get(year) //get the value for this year
    if(yearData) { //keep typescript happy
      const { typeKey, nameKey } = getKeysFromTitle(row.Title)
      const yearType = yearData[typeKey]
      if(yearType) { //keep typescript happy
        if(!yearType.has(nameKey)) { //if we are encountering this nameKey for the first time
          yearType.set(nameKey, { //initialize an empty value
            consolidatedTvData: postData[nameKey] || {...EMPTY_TMDB_TV_DATA},
            score: 0,
            titles: new Map<string, number>(),
          })
        }
        //else we've already seen this nameKey

        if(lastNameKey === nameKey) { //if this is the same name key
          multiplier *= 1 //keep the streak going
        }
        else {
          multiplier = 1
        }

        const titleMap = yearType.get(nameKey)
        const duration = postData[nameKey]?.processedDuration || 42
        updateTitleData(multiplier, row.Title, duration, titleMap)
      }

      lastNameKey = nameKey //record the name key for the next iteration
    }
  }

  return yearDataMap
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
  duration: number,
  titleData?: NameDataType,
) {
  if(titleData) { //keep typescript happy
    const titleCount = titleData.titles.get(title)
    if(titleCount === undefined) { //if we're seeing this title for the first time
      titleData.titles.set(title, 1)
      titleData.score += multiplier * duration
    }
    else { //else we've seen this title before
      titleData.titles.set(title, titleCount + 1)
      titleData.score += multiplier * duration * 1.5 //repeated viewings score for more
    }
  }
}
