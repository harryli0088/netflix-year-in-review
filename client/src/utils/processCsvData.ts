import { CsvDataType } from "utils/parseCsvData"

type TitleDataType = {count: number, titles: Map<string, number>}
type TitleMapType = Map<string,TitleDataType>
export type TitleYearMapType = Map<number, {
  serie: TitleMapType,
  movie: TitleMapType,
}>

export default function processCsvData(rows: CsvDataType[]) {
  const titleYearMap:TitleYearMapType = new Map()

  rows.forEach(row => {
    const year = row.Date.getFullYear()
    if(!titleYearMap.has(year)) {
      titleYearMap.set(year, {
        serie: new Map<string,TitleDataType>(),
        movie: new Map<string,TitleDataType>(),
      })
    }

    const yearData = titleYearMap.get(year)
    if(yearData) {
      const index = row.Title.indexOf(": Season")
      if(index !== -1) { //if this is a serie
        const showTitle = row.Title.slice(0, index)
        if(!yearData.serie.has(showTitle)) {
          yearData.serie.set(showTitle, {
            count: 0,
            titles: new Map<string, number>()
          })
        }

        const obj = yearData.serie.get(showTitle)
        if(obj) {
          const titleCount = obj.titles.get(row.Title)
          if(titleCount !== undefined) {
            obj.titles.set(row.Title, titleCount + 1)
          }
          else {
            obj.titles.set(row.Title, 1)
          }
          obj.count++
        }
      }
      else {
        if(!yearData.movie.has(row.Title)) {
          yearData.movie.set(row.Title, {
            count: 0,
            titles: new Map<string, number>()
          })
        }

        const obj = yearData.movie.get(row.Title)
        if(obj) {
          const titleCount = obj.titles.get(row.Title)
          if(titleCount !== undefined) {
            obj.titles.set(row.Title, titleCount + 1)
          }
          else {
            obj.titles.set(row.Title, 1)
          }
          obj.count++
        }
      }
    }
  })

  // titleYearMap.forEach((yearData, year) => {
  //   const serieData = Array.from(yearData.serie).sort(
  //     (a, b) => {
  //       if(a[1].titles.size > b[1].titles.size) return -1
  //       return 1
  //     }
  //   )
  //   console.log(year, serieData)
  //
  // })

  return titleYearMap
}
