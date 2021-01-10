import React from 'react'
import ImgFromCanvas from 'Components/ImgFromCanvas/ImgFromCanvas'
import processPosterOverviewData from "utils/processPosterOverviewData"
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

  canvasDrawCallback = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const data = processPosterOverviewData(this.props.yearDataMap)

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
