import React from 'react'
import memoize from 'memoize-one'
import backgroundImageSrc from "./top5.jpg"
import "./posterTopX.scss"

export type PosterTopXRequiredProps = {
  imgSrc: string,
  titles: string[],
  year: number,
}

export type Props = PosterTopXRequiredProps

interface State {
  backgroundImage: {height:number, width:number},
  posterImage: {height:number, width:number},
}


const EXPECTED_IMAGE_DIMENSIONS = {
  height: 952,
  width: 1693,
}

export default class PosterTopX extends React.Component<Props,{}> {
  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()
  ctx?: CanvasRenderingContext2D | null

  state = {
    backgroundImage: {height:0, width:0},
    posterImage: {height:0, width:0},
  }

  componentDidMount() {
    if(this.canvasRef.current) {
      this.ctx = this.canvasRef.current.getContext('2d')
      this.forceUpdate()
    }
  }

  componentDidUpdate() {
    const {
      imgSrc,
      titles,
      year,
    } = this.props

    const ctx = this.ctx
    if(ctx) {
      ctx.font = '120px Bebas Neue'
      ctx.drawImage(this.getBackgroundImage(backgroundImageSrc), 0, 0)
      ctx.drawImage(
        this.getPosterImage(imgSrc),
        329 - this.state.posterImage.width,
        225,
        EXPECTED_IMAGE_DIMENSIONS.width,
        EXPECTED_IMAGE_DIMENSIONS.height,
      )

      ctx.fillStyle = "white";
      ctx.fillText(this.props.titles[0], this.state.backgroundImage.width/3 - 100, this.state.backgroundImage.height*2/3 + 50)

      ctx.font = '80px Bebas Neue'
      titles.slice(1).forEach((t,i) => {
        if(ctx) {
          ctx.fillText(t, this.state.backgroundImage.width/3 - 100, this.state.backgroundImage.height*2/3 + 175 + 89*i)
        }
      })
    }
  }

  getBackgroundImage = memoize(
    (imgSrc: string) => {
      const img = new Image()
      img.src = imgSrc

      img.onload = () => this.setState({
        backgroundImage: {height: img.height, width: img.width}
      })

      return img
    }
  )

  getPosterImage = memoize(
    (imgSrc: string) => {
      const img = new Image()
      img.src = imgSrc

      img.onload = () => this.setState({
        posterImage: {height: img.height, width: img.width}
      })

      return img
    }
  )


  render() {
    return (
      <div className="poster">
        <canvas ref={this.canvasRef} width={this.state.backgroundImage.width} height={this.state.backgroundImage.height}/>
      </div>
    )
  }
}
