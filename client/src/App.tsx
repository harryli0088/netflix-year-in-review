import React from 'react'
import memoize from 'memoize-one'
import PosterTopX, { PosterTopXRequiredProps } from 'Components/PosterTopX/PosterTopX'
import { TOP_X, YEAR } from "consts"
import parseCsvData, { CsvDataType } from "utils/parseCsvData"
import processCsvData, { TitleYearMapType } from "utils/processCsvData"
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
  titleYearMap: TitleYearMapType,
  topXData: PosterTopXRequiredProps,
}

class App extends React.Component<{},State> {
  state:State = {
    csvData: [],
    errors: [],
    status: "",
    titleYearMap: new Map(),
    topXData: { imgSrc: "", titles: [], year: 0 }
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
      const titleYearMap = processCsvData(rows)

      const yearData = titleYearMap.get(YEAR)
      if(yearData) {
        this.setState({
          csvData: rows,
          titleYearMap,
        })
        this.getTopXData(titleYearMap, YEAR)
      }
    }).catch(err => console.error(err))
  }

  getTopXData = memoize(
    async (titleYearMap: TitleYearMapType, year: number) => {
      const data = titleYearMap.get(year)
      if(data) {
        const serieData = Array.from(data.serie).sort(
          (a, b) => {
            if(a[1].titles.size > b[1].titles.size) return -1
            return 1
          }
        )

        const titles = serieData.slice(0, TOP_X).map(d => d[0])
        this.setState({
          topXData: {
            imgSrc: await this.getImgSrcFromTitle(titles[0]),
            titles,
            year: YEAR,
          }
        })
      }
    }
  )

  getImgSrcFromTitle = memoize(
    async (title:string) => {
      return "https://occ-0-444-465.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABUtYiPtQlYLrwSZI6ibYvbn0GHuqySPWlkC9Z9UTxP72KwHjTgmp1Rt90W0euR26wceJ-Wiogmcbtvg4FIBVxKVl_TFg.jpg?r=2a2"
    }
  )



  renderData = () => {
    if(this.state.topXData.imgSrc) {
      return (
        <div>
          <PosterTopX
            {...this.state.topXData}
          />
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
