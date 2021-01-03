import React from 'react'
import ImgFromCanvas from 'Components/ImgFromCanvas/ImgFromCanvas'
import backgroundImageSrc from "./overview.jpg"

export type PosterOverviewProps = {
  duration: number,
  movieCount: number,
  serieCount: number,
}

interface State {
}


export default class PosterTopX extends React.Component<PosterOverviewProps,State> {
  constructor(props:PosterOverviewProps) {
    super(props)

    this.state = {
    }
  }

  componentDidMount() {
    this.forceUpdate()
  }

  canvasDrawCallback = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.font = '556px Bebas Neue'
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.fillText(this.props.duration.toString(), 540, 486)
  }


  render() {
    return (
      <ImgFromCanvas backgroundImageSrc={backgroundImageSrc} canvasDrawCallback={this.canvasDrawCallback}/>
    )
  }
}
