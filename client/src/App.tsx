import React from 'react'
import memoize from 'memoize-one'
import Modal from 'react-bootstrap/Modal'
import Landing from 'Components/Landing/Landing'
import PosterTopX, { PosterTopXRequiredProps } from 'Components/PosterTopX/PosterTopX'
import { SERVER_URL, TOP_X, YEAR } from "consts"
import parseCsvData, { CsvDataType } from "utils/parseCsvData"
import processCsvData, { ConsolidatedTmdbTvType, YearDataMapType } from "utils/processCsvData"
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
  canCloseModal: boolean,
  csvData: CsvDataType[],
  errors: string[],
  status: string,
  yearDataMap: YearDataMapType,
  topXData: PosterTopXRequiredProps,
}

class App extends React.Component<{},State> {
  state:State = {
    canCloseModal: false,
    csvData: [],
    errors: [],
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
    this.setStatus("Fetching data...")
    const yearDataMap = await processCsvData(rows)

    const yearData = yearDataMap.get(YEAR)
    console.log(yearData)
    if(yearData) {
      this.setState({
        csvData: rows,
        yearDataMap,
      })
      this.setStatus("Processing Top 5 Data")
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

  setStatus = (status:string, canCloseModal:boolean=false) => this.setState({status,canCloseModal})

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
        setStatus={this.setStatus}
      />
    )
  }

  render() {
    return (
      <div className="App">
        <Modal centered show={this.state.status.length > 0}>
          <Modal.Header closeButton={this.state.canCloseModal}>
            <Modal.Title style={{color: "black"}}>{this.state.status}</Modal.Title>
          </Modal.Header>
        </Modal>

        {this.renderContent()}
      </div>
    )
  }
}

export default App;
