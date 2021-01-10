import memoize from 'memoize-one'
import { YEAR } from "consts"
import { YearDataMapType } from "utils/processCsvData"

const processPosterOverviewData = memoize(
  (yearDataMap: YearDataMapType) => {
    const data = {
      duration: 0,
      movieCount: 0,
      serieCount: 0,
    }

    const yearData = yearDataMap.get(YEAR)
    if(yearData) {
      data.movieCount = yearData.movie.size + 10
      yearData.movie.forEach((nameData) => {
        let count = 0
        nameData.titles.forEach((titleCount) => {
          count += titleCount
        })
        data.duration += count* nameData.tmdbData.runtime
      })

      data.serieCount = yearData.serie.size
      yearData.serie.forEach((nameData) => {
        let count = 0
        nameData.titles.forEach((titleCount) => {
          count += titleCount
        })
        data.duration += count* nameData.tmdbData.processedDuration
      })
    }

    return data
  }
)

export default processPosterOverviewData
