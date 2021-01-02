import React from 'react'
import memoize from 'memoize-one'
import Landing from 'Components/Landing/Landing'
import PosterTopX, { PosterTopXRequiredProps } from 'Components/PosterTopX/PosterTopX'
import { SERVER_URL, TOP_X, YEAR } from "consts"
import parseCsvData, { CsvDataType } from "utils/parseCsvData"
import processCsvData, { ConsolidatedTmdbTvType, TitleYearMapType } from "utils/processCsvData"
import './App.scss'

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
    topXData: { imgSrcs: [], titles: [], year: 0 }
  }

  componentDidMount() {
    if(process.env.NODE_ENV === "development") {
      this.fetchCsv()
    }
    fetch(`${SERVER_URL}/`)
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
    }).then(parseCsvData).then(this.processData).catch(err => console.error(err))
  }

  processData = async (rows:CsvDataType[]) => {
    console.log(rows)
    const titleYearMap = await processCsvData(rows)

    const yearData = titleYearMap.get(YEAR)
    console.log(yearData)
    if(yearData) {
      this.setState({
        csvData: rows,
        titleYearMap,
      })
      this.getTopXData(titleYearMap, YEAR)
    }
  }

  getTopXData = memoize(
    async (titleYearMap: TitleYearMapType, year: number) => {
      const data = titleYearMap.get(year)
      if(data) {
        const serieData = Array.from(data.serie).sort(
          (a, b) => {
            if(a[1].count > b[1].count) return -1
            return 1
          }
        )
        // console.log(serieData)

        // const topXSeriesData = serieData.slice(0, TOP_X)
        // this.setState({
        //   topXData: {
        //     imgSrcs: topXSeriesData.map(
        //       (d,i) => i===0 ? d[1].consolidatedTvData.backdrop_path : d[1].consolidatedTvData.poster_path
        //     ),
        //     titles: topXSeriesData.map(d => d[0]),
        //     year: YEAR,
        //   }
        // })
      }
    }
  )

  fileContentCallback = (content:string) => {
    this.processData(parseCsvData(content)).catch(console.error)
  }


  renderContent = () => {
    if(this.state.topXData.imgSrcs.length > 0) {
      return (
        <div>
          <PosterTopX
            {...this.state.topXData}
          />
        </div>
      )
    }

    return (
      <Landing
        fileContentCallback={this.fileContentCallback}
      />
    )
  }

  render() {
    return (
      <div className="App">
        {this.renderContent()}
      </div>
    )
  }
}

export default App;
