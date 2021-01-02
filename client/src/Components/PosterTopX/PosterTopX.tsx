import React from 'react'
import memoize from 'memoize-one'
import CustomContainer from 'Components/CustomContainer/CustomContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faShare } from '@fortawesome/free-solid-svg-icons'
import multilineFillText from "utils/multilineFillText"
import shareApi from "utils/shareApi"
import backgroundImageSrc from "./top5.jpg"
import no1 from "./no1.png"
import "./posterTopX.scss"


const IMG_BOUNDS:{x:number, y:number, width:number, height:number}[] = [
  {x: 8,   y: 207, width: 1063, height: 598},
  {x: 8,   y: 980, width: 259, height: 382},
  {x: 275, y: 980, width: 260, height: 383},
  {x: 542, y: 979, width: 260, height: 383},
  {x: 810, y: 980, width: 261, height: 382},
]

export type PosterTopXRequiredProps = {
  imgSrcs: string[],
  titles: string[],
  year: number,
}

export type Props = PosterTopXRequiredProps

interface State {
  backgroundImgDims: {height:number, width:number},
  posterImage: {height:number, width:number},
  showShare: boolean,
}


export default class PosterTopX extends React.Component<Props,State> {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  imgRef: React.RefObject<HTMLImageElement> = React.createRef()
  images: HTMLImageElement[] = []

  constructor(props:Props) {
    super(props)

    this.state = {
      backgroundImgDims: {height:0, width:0},
      posterImage: {height:0, width:0},
      showShare: navigator.share !== undefined,
    }

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  componentDidMount() {
    this.forceUpdate()
  }

  componentDidUpdate = () => {
    const {
      imgSrcs,
      titles,
      year,
    } = this.props

    const {
      backgroundImgDims,
      posterImage,
    } = this.state

    const ctx = this.ctx
    const backgroundImg = this.getBackgroundImage(backgroundImageSrc)
    const imgs = this.getImages(imgSrcs)
    if(
      ctx
      && backgroundImgDims.width > 0
      && backgroundImgDims.height > 0
    ) {
      try {
        console.log(JSON.parse(JSON.stringify(backgroundImgDims)))
        this.canvas.width = backgroundImgDims.width
        this.canvas.height = backgroundImgDims.height

        ctx.save()

        ctx.drawImage(backgroundImg, 0, 0) //background image

        ctx.font = '150px Bebas Neue'
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        multilineFillText(ctx, titles[0], IMG_BOUNDS[0].x, IMG_BOUNDS[0].y, IMG_BOUNDS[0].width, IMG_BOUNDS[0].height) //alt text
        ctx.drawImage(
          imgs[0],
          IMG_BOUNDS[0].x,
          IMG_BOUNDS[0].y,
          IMG_BOUNDS[0].width,
          IMG_BOUNDS[0].height,
        ) //main image
        ctx.drawImage(this.getNo1Image(no1), 30, 207) //red #1 overlay

        ctx.font = '60px Bebas Neue'
        IMG_BOUNDS.slice(1).forEach((bounds,i) => {
          multilineFillText(ctx, titles[i+1], bounds.x, bounds.y, bounds.width, bounds.height) //alt text
          ctx.drawImage(imgs[i+1], bounds.x, bounds.y, bounds.width, bounds.height) //poster img
        })

        //main title
        ctx.font = '110px Bebas Neue'
        ctx.fillText(titles[0], 540, 920 , 1080)

        //2-5 show titles
        ctx.font = '72px Bebas Neue'
        ctx.textAlign = "left"
        ctx.fillText(titles[1], 149, 1450, 900)
        ctx.fillText(titles[2], 163, 1540, 900)
        ctx.fillText(titles[3], 182, 1630, 900)
        ctx.fillText(titles[4], 198, 1720, 900)

        ctx.restore()

        //set the source of the image in the DOM
        if(this.imgRef.current) {
          this.imgRef.current.src = this.canvas.toDataURL("image/png")
        }
      }
      catch(err) {
        console.error(err)
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

  getNo1Image = memoize(
    (imgSrc: string) => {
      const img = new Image()
      img.src = imgSrc
      img.setAttribute('crossorigin', 'anonymous')
      img.onload = () => this.forceUpdate()

      return img
    }
  )

  getImages = memoize(
    (imgSrcs: string[]) => imgSrcs.map((imgSrc) => {
      const img = new Image()
      img.src = imgSrc
      img.setAttribute('crossorigin', 'anonymous')
      img.onload = () => this.forceUpdate()

      return img
    })
  )

  download = () => {
    const a = document.createElement("a")
    a.href = this.canvas.toDataURL("image/png")
    a.download = "Netflix_Year_In_Review_Top_5.png"
    a.click()
  }

  share = () => {
    this.canvas.toBlob((blob) => {
      if(blob) {
        shareApi(blob)
        // const dumb = async () => {
        //   if(await shareApi(blob) === false) {
        //     this.setState({showShare: true})
        //   }
        // }
        //
        // dumb()
      }
    })
  }

  showShare = () => {
    if(this.state.showShare) {
      return (
        <button onClick={e => this.share()}>
          <FontAwesomeIcon icon={faShare}/> Share
        </button>
      )
    }
  }


  render() {
    return (
      <CustomContainer>
        <div className="poster">
          <img ref={this.imgRef} alt="Loading..."/>
          <br/><br/>

          {/* <div>
            <button onClick={e => this.download()}><FontAwesomeIcon icon={faDownload}/> Save Image</button>
            {this.showShare()}
          </div> */}

          <div className="description">
            <p>Save & Share on your social media with <b>#nyir2020</b>!</p>
            <p className="mobileOnly">(To Save Image, Tap + Hold)</p>
            <p className="desktopOnly">(To Save Image, Right Click -{">"} Save As...)</p>
          </div>
        </div>
      </CustomContainer>
    )
  }
}
