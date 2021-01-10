import memoize from 'memoize-one'
import { TOP_X, YEAR } from "consts"
import { YearDataMapType } from "utils/processCsvData"

const processPosterTopXData = memoize(
  (yearDataMap: YearDataMapType):{imgSrcs: string[], titles: string[]} => {
    const data = yearDataMap.get(YEAR)
    if(data) {
      const serieData = Array.from(data.serie).sort(
        (a, b) => {
          if(a[1].score > b[1].score) return -1
          return 1
        }
      )
      console.log("serieData",serieData)

      const topXSeriesData = serieData.slice(0, TOP_X)

      return {
        imgSrcs: topXSeriesData.map(
          (d,i) => i===0 ? d[1].tmdbData.backdrop_path : d[1].tmdbData.poster_path
        ),
        titles: topXSeriesData.map(d => d[0]),
      }
    }

    return {imgSrcs: [], titles: []}
  }
)

export default processPosterTopXData
