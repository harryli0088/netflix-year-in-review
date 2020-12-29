import React from 'react'
import memoize from 'memoize-one'
import PosterTopX, { PosterTopXRequiredProps } from 'Components/PosterTopX/PosterTopX'
import { SERVER_URL, TOP_X, YEAR } from "consts"
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
      console.log(yearData)
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

        const titles = serieData.map(d => d[0])
        const {
          firstValidTitleIndex,
          imgSrc,
        } = await this.getImgSrcFromTitle(titles)
        this.setState({
          topXData: {
            imgSrc,
            titles: titles.slice(firstValidTitleIndex, firstValidTitleIndex + TOP_X),
            year: YEAR,
          }
        })
      }
    }
  )

  getImgSrcFromTitle = memoize(
    /**
     * return the index and imgSrc of the first valid title on netflix
     * @param  titles array of titles, sorted in the order of your choosing
     * @return        object with fields firstValidTitleIndex and imgSrc
     */
    async (titles:string[]) => {
      //loop through all the titles
      for(let titleIndex=0; titleIndex<titles.length; ++titleIndex) {
        try {
          //try to get the top node id
          const topNodeId = parseInt(
            await fetch(`${SERVER_URL}/topNodeIdFromTitle/${titles[titleIndex]}`).then(response => response.text())
          )

          //if the top node id is valid
          if(!isNaN(topNodeId)) {
            const data:TVSeriesType = await fetch(`${SERVER_URL}/title/${topNodeId}`).then(response => response.json())
            return {
              firstValidTitleIndex: titleIndex,
              imgSrc: data.image,
            }
          }
          else {
            throw new Error(`No top node id returned for ${titles[titleIndex]}`)
          }
        }
        catch(err) { //if there was some error, move on to the next title in the array
          console.error(err)
        }
      }

      //we didn't find any valid titles
      return {
        firstValidTitleIndex: -1,
        imgSrc: "",
      }
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
