import React from 'react'
import memoize from 'memoize-one'
import { YEAR } from "consts"
import ImgFromCanvas from 'Components/ImgFromCanvas/ImgFromCanvas'
import { YearDataMapType } from "utils/processCsvData"
import backgroundImageSrc from "./overview.png"

type Props = {
  yearDataMap: YearDataMapType,
}

interface State {
}


export default class PosterTopX extends React.Component<Props,State> {
  componentDidMount() {
    this.forceUpdate()
  }

  processData = memoize(
    (yearDataMap: YearDataMapType) => {
      const data = {
        duration: 0,
        movieCount: 0,
        serieCount: 0,
      }

      const yearData = yearDataMap.get(YEAR)
      if(yearData) {
        data.movieCount = yearData.movie.size + 10
        yearData.movie.forEach((nameData) => {
          console.log("nameData",nameData)
          data.duration += nameData.tmdbData.runtime
        })

        data.serieCount = yearData.serie.size
        yearData.serie.forEach((nameData) => {
          data.duration += nameData.tmdbData.processedDuration
        })
      }

      return data
    }
  )

  canvasDrawCallback = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const data = this.processData(this.props.yearDataMap)

    ctx.font = '556px Bebas Neue'
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.fillText(Math.ceil(data.duration/60).toString(),540,540)

    ctx.font = '280px Bebas Neue'
    ctx.fillText(data.movieCount.toString(),295,1430)
    ctx.fillText(data.serieCount.toString(),785,1430)
  }


  render() {
    return (
      <ImgFromCanvas backgroundImageSrc={backgroundImageSrc} canvasDrawCallback={this.canvasDrawCallback}/>
    )
  }
}
