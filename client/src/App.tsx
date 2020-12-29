import React from 'react'
import PosterTopX from 'Components/PosterTopX/PosterTopX'
import { TOP_X, YEAR } from "consts"
import getTvShowYearSortedMap, { TopNodeIdYearSortedMapType } from "utils/getTvShowYearSortedMap"
import parseCsvData, { CsvDataType } from "utils/parseCsvData"
import './App.css'

export type TVSeriesType = {
  "@context": string,
  "@type": string,
  actors: {
    "@type": string,
    name: string,
  }[],
  awards: string,
  contentRating: string,
  creator: {
    "@type": string,
    name: string,
  }[],
  dateCreated: string,
  description: string,
  director: {
    "@type": string,
    name: string,
  }[],
  genre: string,
  image: string,
  name: string,
  numberOfSeasons: number,
  startDate: string,
  url: string,
}


interface State {
  csvData: CsvDataType[],
  errors: string[],
  status: string,
  topXData: TVSeriesType[],
  tvShowYearSortedMap: TopNodeIdYearSortedMapType,
}

class App extends React.Component<{},State> {
  state:State = {
    csvData: [],
    errors: [],
    status: "",
    tvShowYearSortedMap: new Map(),
    topXData: [],
  }

  componentDidMount() {
    this.fetchCsv()
  }


  fetchCsv() {
    fetch('/example.csv').then((response) => {
      if(response && response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')

        return reader.read().then(
          (result) => decoder.decode(result.value)
        )
      }
      else {
        throw new Error("No response or body")
      }
    }).then(parseCsvData).then(async (rows) => {
      console.log(rows)
      this.processCsvData(rows)
    }).catch(err => console.error(err))
  }

  processCsvData = async (rows: CsvDataType[]) => {
    const data: Map<number, {
      serie: Map<string,{count: number, titles: Map<string, number>}>,
      movie: Map<string,{count: number, titles: Map<string, number>}>,
    }> = new Map()

    rows.forEach(row => {
      const year = row.Date.getFullYear()
      if(!data.has(year)) {
        data.set(year, {
          serie: new Map<string,{count: number, titles: Map<string, number>}>(),
          movie: new Map<string,{count: number, titles: Map<string, number>}>(),
        })
      }

      const yearData = data.get(year)
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

    data.forEach((yearData, year) => {
      const serieData = Array.from(yearData.serie).sort(
        (a, b) => {
          if(a[1].titles.size > b[1].titles.size) return -1
          return 1
        }
      )
      console.log(year, serieData)

    })
  }



  renderData = () => {
    if(this.state.topXData.length > 0) {
      return (
        <div>
          <PosterTopX data={this.state.topXData}/>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="App">

        {this.renderData()}
      </div>
    )
  }
}

export default App;
