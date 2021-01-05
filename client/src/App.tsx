import React from 'react'
import BrowserModal from 'Components/BrowserModal/BrowserModal'
import CustomModal from 'Components/CustomModal/CustomModal'
import Landing from 'Components/Landing/Landing'
import NavBar from 'Components/NavBar/NavBar'
import Results from 'Components/Results/Results'
import { SERVER_URL } from "consts"
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
  showCloseButton: boolean,
  showLoadingSpinner: boolean,
  status: string | JSX.Element,
  yearDataMap: YearDataMapType,
}

class App extends React.Component<{},State> {
  state:State = {
    csvData: [],
    errors: [],
    showCloseButton: false,
    showLoadingSpinner: false,
    status: "",
    yearDataMap: new Map(),
  }

  componentDidMount() {
    if(process.env.NODE_ENV === "development") {
      // this.fetchCsv()
    }
    fetch(`${SERVER_URL}/`)
  }


  fetchCsv() { //use for development
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

    this.setState({
      csvData: rows,
      yearDataMap: await processCsvData(rows),
    })
    this.setStatus("")
  }

  fileContentCallback = (content:string) => {
    this.processData(parseCsvData(content)).catch(console.error)
  }

  setStatus = (
    status:string="",
    showCloseButton:boolean=false,
    showLoadingSpinner:boolean=true
  ) => this.setState({status,showCloseButton,showLoadingSpinner})

  renderContent = () => {
    if(this.state.yearDataMap.size > 0) {
      return (
        <div>
          <Results
            yearDataMap={this.state.yearDataMap}
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
        <BrowserModal/>
        
        <CustomModal
          close={() => this.setStatus("",false)}
          content={this.state.status}
          showCloseButton={this.state.showCloseButton}
          showLoadingSpinner={this.state.showLoadingSpinner}
          showModal={this.state.status !== ""}
        />

        <NavBar showFeedback={this.state.yearDataMap.size > 0}/>

        {this.renderContent()}
      </div>
    )
  }
}

export default App;
