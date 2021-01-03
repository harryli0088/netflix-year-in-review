import React from 'react'
import memoize from 'memoize-one'
import drawImage from "utils/drawImage"
import "./imgFromCanvas.scss"

export type Props = {
  backgroundImageSrc: string,
  canvasDrawCallback: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => any,
}

interface State {
  backgroundImgDims: {height:number, width:number},
}


export default class ImgFromCanvas extends React.Component<Props,State> {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  imgRef: React.RefObject<HTMLImageElement> = React.createRef()

  constructor(props:Props) {
    super(props)

    this.state = {
      backgroundImgDims: {height:0, width:0},
    }

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  componentDidMount() {
    this.forceUpdate()
  }

  componentDidUpdate = () => {
    const {
      backgroundImageSrc,
      canvasDrawCallback,
    } = this.props

    const {
      backgroundImgDims,
    } = this.state

    const ctx = this.ctx
    const backgroundImg = this.getBackgroundImage(backgroundImageSrc)
    if(ctx) {
      if(backgroundImgDims.width > 0 && backgroundImgDims.height > 0) {
        this.canvas.width = backgroundImgDims.width
        this.canvas.height = backgroundImgDims.height

        drawImage(ctx, backgroundImg, 0, 0) //background image

        ctx.save()
        canvasDrawCallback(this.canvas, ctx)
        ctx.restore()
      }
      else {
        ctx.save()
        this.canvas.width = 1080
        this.canvas.height = 1920

        ctx.fillStyle = "white"
        ctx.font = '60px Bebas Neue'
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("Loading...", 540, 300)
        ctx.restore()
      }

      //set the source of the image in the DOM
      if(this.imgRef.current) {
        this.imgRef.current.src = this.canvas.toDataURL("image/png")
      }
    }
  }

  getBackgroundImage = memoize(
    (imgSrc: string) => {
      const img = new Image()
      img.src = imgSrc
      img.setAttribute('crossorigin', 'anonymous')
      img.onload = () => this.setState({
        backgroundImgDims: {height: img.height, width: img.width}
      })

      return img
    }
  )


  render() {
    return (
      <img ref={this.imgRef} alt="Loading..."/>
    )
  }
}
