import React from 'react'
import memoize from 'memoize-one'
import Landing from 'Components/Landing/Landing'
import PosterTopX, { PosterTopXRequiredProps } from 'Components/PosterTopX/PosterTopX'
import { SERVER_URL, TOP_X, YEAR } from "consts"
import parseCsvData, { CsvDataType } from "utils/parseCsvData"
import processCsvData, { TitleYearMapType } from "utils/processCsvData"
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
    topXData: { align: "", imgSrc: "", titles: [], year: 0 }
  }

  componentDidMount() {
    this.fetchCsv()
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
    const titleYearMap = processCsvData(rows)

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
            if(a[1].titles.size > b[1].titles.size) return -1
            return 1
          }
        )

        const titles = serieData.slice(0, TOP_X).map(d => d[0])
        this.setState({
          topXData: {
            ...await this.getImgSrcFromTitle(titles[0]),
            titles,
            year: YEAR,
          }
        })
      }
    }
  )

  getImgSrcFromTitle = memoize(
    async (title:string) => {
      try {
        //try to get the top node id
        const topNodeId = parseInt(
          await fetch(`${SERVER_URL}/topNodeIdFromTitle/${title}`).then(response => response.text())
        )

        //if the top node id is valid
        if(!isNaN(topNodeId)) {
          const data:TVSeriesType = await fetch(`${SERVER_URL}/title/${topNodeId}`).then(response => response.json())
          return {
            align: "right",
            imgSrc: data.image,
          }
        }
        else {
          throw new Error(`No top node id returned for ${title}`)
        }
      }
      catch(err) { //if there was some error, move on to the next title in the array
        console.error(err)
      }


      try {
        const data = await fetch(`${SERVER_URL}/tmdbInfo/${title}`).then(response => response.json())
        const imgSrc = `https://image.tmdb.org/t/p/original/${data.results[0].backdrop_path}`
        console.log(imgSrc)
        return {
          align: "center",
          imgSrc,
        }
      }
      catch(err) {
        console.error(err)
      }

      //we didn't find any valid images
      return {align:"",imgSrc:""}
    }
  )

  fileContentCallback = (content:string) => {
    this.processData(parseCsvData(content)).catch(console.error)
  }


  renderContent = () => {
    if(this.state.topXData.imgSrc) {
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
