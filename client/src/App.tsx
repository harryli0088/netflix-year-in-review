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
  topXShowData: TVSeriesType[],
  tvShowYearSortedMap: TopNodeIdYearSortedMapType,
}

class App extends React.Component<{},State> {
  state:State = {
    csvData: [],
    errors: [],
    status: "",
    tvShowYearSortedMap: new Map(),
    topXShowData: [],
  }

  componentDidMount() {
    this.fetchCsv()
  }

  componentDidUpdate(prevProps: {}, prevState: State) {
    if(this.state.tvShowYearSortedMap !== prevState.tvShowYearSortedMap) {
      this.requestTitleData()
    }
  }

  onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    this.requestTitleData()
  }

  requestTitleData = async () => {
    this.setState({
      errors: [],
      status: "loading",
    })

    const topNodeIdsInYear = this.state.tvShowYearSortedMap.get(YEAR)
    if(topNodeIdsInYear) {
      const ids:string[] = topNodeIdsInYear.slice(0,TOP_X).map((pair) => pair[0])
      const results = await Promise.all(
        ids.map(async id => {
          try {
            const data:TVSeriesType = await fetch(`http://localhost:5000/title/${id}`).then(response => response.json())
            return data
          }
          catch(err) {
            console.error(err)
            this.setState({
              errors: [err.message],
              status: "error",
            })
          }
        })
      )


      const topXShowData:TVSeriesType[] = []
      results.forEach(r => {
        if(r) {
          topXShowData.push(r)
        }
      })

      console.log(topXShowData)
      this.setState({
        status: "",
        topXShowData,
      })
    }
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
    }).then(parseCsvData).then((rows) => {
      this.setState({
        csvData: rows,
        tvShowYearSortedMap: getTvShowYearSortedMap(rows),
      })
    }).catch(err => console.error(err))
  }

  renderData = () => {
    if(this.state.topXShowData.length > 0) {
      return (
        <div>
          <PosterTopX data={this.state.topXShowData}/>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="App">
        {this.state.errors.map((e,i) => <div key={i}>{e}</div>)}

        {this.renderData()}
      </div>
    )
  }
}

export default App;
