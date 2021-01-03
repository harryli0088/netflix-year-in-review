import React from 'react'
import memoize from 'memoize-one'
import CustomModal from 'Components/CustomModal/CustomModal'
import Landing from 'Components/Landing/Landing'
import Results from 'Components/Results/Results'
import { PosterOverviewProps } from 'Components/PosterOverview/PosterOverview'
import { PosterTopXProps } from 'Components/PosterTopX/PosterTopX'
import { SERVER_URL, TOP_X, YEAR } from "consts"
import parseCsvData, { CsvDataType } from "utils/parseCsvData"
import processCsvData, { YearDataMapType } from "utils/processCsvData"
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
  overviewData: PosterOverviewProps,
  showCloseButton: boolean,
  showLoadingSpinner: boolean,
  status: string | JSX.Element,
  yearDataMap: YearDataMapType,
  topXData: PosterTopXProps,
}

class App extends React.Component<{},State> {
  state:State = {
    csvData: [],
    errors: [],
    overviewData: {duration: 406, movieCount: 0, serieCount: 0},
    showCloseButton: false,
    showLoadingSpinner: false,
    status: "",
    yearDataMap: new Map(),
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
    this.setStatus("Processing data...")
    const yearDataMap = await processCsvData(rows)

    const yearData = yearDataMap.get(YEAR)
    console.log(yearData)
    if(yearData) {
      this.setState({
        csvData: rows,
        yearDataMap,
      })
      this.setStatus("Processing Top 5 Data...")
      this.getTopXData(yearDataMap, YEAR)
    }
  }

  getTopXData = memoize(
    async (yearDataMap: YearDataMapType, year: number) => {
      const data = yearDataMap.get(year)
      if(data) {
        const serieData = Array.from(data.serie).sort(
          (a, b) => {
            if(a[1].score > b[1].score) return -1
            return 1
          }
        )
        console.log("serieData",serieData)

        const topXSeriesData = serieData.slice(0, TOP_X)
        this.setState({
          topXData: {
            imgSrcs: topXSeriesData.map(
              (d,i) => i===0 ? d[1].consolidatedTvData.backdrop_path : d[1].consolidatedTvData.poster_path
            ),
            titles: topXSeriesData.map(d => d[0]),
            year: YEAR,
          }
        })
      }

      this.setStatus("")
    }
  )

  fileContentCallback = (content:string) => {
    this.processData(parseCsvData(content)).catch(console.error)
  }

  setStatus = (
    status:string="",
    showCloseButton:boolean=false,
    showLoadingSpinner:boolean=true
  ) => this.setState({status,showCloseButton,showLoadingSpinner})

  renderContent = () => {
    if(this.state.topXData.imgSrcs.length > 0) {
      return (
        <div>
          <Results
            overviewData={this.state.overviewData}
            topXData={this.state.topXData}
          />
        </div>
      )
    }

    return (
      <Landing
        fileContentCallback={this.fileContentCallback}
        setStatus={this.setStatus}
      />
    )
  }

  render() {
    return (
      <div className="App">
        <CustomModal
          close={() => this.setStatus("",false)}
          content={this.state.status}
          showCloseButton={this.state.showCloseButton}
          showLoadingSpinner={this.state.showLoadingSpinner}
          showModal={this.state.status !== ""}
        />

        {this.renderContent()}
      </div>
    )
  }
}

export default App;
