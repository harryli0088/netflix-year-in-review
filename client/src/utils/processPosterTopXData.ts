import memoize from 'memoize-one'
import { TOP_X, YEAR } from "consts"
import { YearDataMapType } from "utils/processCsvData"

export type ProcessPosterTopXDataType = {imgSrcs: string[], titles: string[]}
const processPosterTopXData = memoize(
  (yearDataMap: YearDataMapType):ProcessPosterTopXDataType => {
    const data = processPosterTopData(yearDataMap)

    return {
      imgSrcs: data.imgSrcs.slice(0, TOP_X),
      titles: data.titles.slice(0, TOP_X),
    }
  }
)

export default processPosterTopXData



export type ProcessPosterTopDataType = ProcessPosterTopXDataType & {scores:number[]}
export const processPosterTopData = memoize(
  (yearDataMap: YearDataMapType):ProcessPosterTopDataType => {
    const data = yearDataMap.get(YEAR)
    if(data) {
      const serieData = Array.from(data.serie).sort(
        (a, b) => {
          if(a[1].score > b[1].score) return -1
          return 1
        }
      )
      console.log("serieData",serieData)

      const topXSeriesData = serieData.slice(0)

      return {
        imgSrcs: topXSeriesData.map(
          (d,i) => i===0 ? d[1].tmdbData.backdrop_path : d[1].tmdbData.poster_path
        ),
        titles: topXSeriesData.map(d => d[0]),
        scores: topXSeriesData.map(d => d[1].score),
      }
    }

    return {imgSrcs: [], titles: [], scores: []}
  }
)
