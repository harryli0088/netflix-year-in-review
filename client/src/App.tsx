import React from 'react'
import { csvParse } from "d3"
import PosterTopX from 'Components/PosterTopX/PosterTopX'
import { TOP_X, YEAR } from "consts"
import './App.css'

export type CsvDataType = {
  Country: string,
  "Device Type": string,
  Duration: string,
  "Duration (s)": number,
  "Movie ID": string,
  Timestamp: Date,
  Title: string,
  "Top Node ID": string,
  Type: string,
}

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

type TopNodeIdCountPairType = [string, number]

type TopNodeIdYearSortedMapType = Map<number, TopNodeIdCountPairType[]>

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
    }).then((data) => {
      if(data) {
        const parsedData = csvParse(data)
        const rows: CsvDataType[] = []
        for(let i=0; i<parsedData.length; ++i) {
          const rawRow = parsedData[i]
          // @ts-ignore
          rows.push({
            ...rawRow,
            "Duration (s)": parseInt(rawRow["Duration (s)"] || "0"),
            Timestamp: new Date(rawRow.Timestamp || new Date()),
          })
        }

        return rows
      }
      else {
        throw new Error("No data")
      }
    }).then((rows) => {
      const tvShowCounterMap = new Map<string, number>()
      rows.forEach(row => {
        //if this is a TV Series type
        if(row.Type === "Serie") {
          const topNodeId = row["Top Node ID"] //get the top node id
          const key = `${row.Timestamp.getFullYear()}-${topNodeId}`
          if(!tvShowCounterMap.has(key)) { //if we are encountering this top node for the first time
            tvShowCounterMap.set(key, 0) //initialize the counter to 0
          }

          //increment the counter
          tvShowCounterMap.set(
            key,
            (tvShowCounterMap.get(key) || 0) + row["Duration (s)"],
          )
        }
      })

      const tvShowYearSortedMap = new Map<number, TopNodeIdCountPairType[]>()
      tvShowCounterMap.forEach((value:number, key:string) => {
        const split = key.split("-")
        const year = parseInt(split[0])
        const topNodeId = split[1]

        if(!tvShowYearSortedMap.has(year)) { //if we are encountering this year for the first time
          tvShowYearSortedMap.set(year, []) //initialize an empty array
        }

        const topNodeIdsInYear = tvShowYearSortedMap.get(year)
        if(topNodeIdsInYear) {
          topNodeIdsInYear.push([topNodeId, value])
        }
      })

      tvShowYearSortedMap.forEach((topNodeIdsInYear:TopNodeIdCountPairType[], year: number) => {
        topNodeIdsInYear.sort(
          (a:TopNodeIdCountPairType,b:TopNodeIdCountPairType) => {
            if(a[1] < b[1]) return 1
            else if(a[1] > b[1]) return -1
            return 0
          }
        )
      })
      console.log(tvShowYearSortedMap)

      this.setState({
        csvData: rows,
        tvShowYearSortedMap,
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
