import React from 'react'
import memoize from 'memoize-one'
import CustomContainer from 'Components/CustomContainer/CustomContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faShare } from '@fortawesome/free-solid-svg-icons'
import shareApi from "utils/shareApi"
import backgroundImageSrc from "./top5.png"
import no1 from "./no1.png"
import "./posterTopX.scss"

const DPR = window.devicePixelRatio

export type PosterTopXRequiredProps = {
  imgSrcs: string[],
  titles: string[],
  year: number,
}

export type Props = PosterTopXRequiredProps

interface State {
  backgroundImage: {height:number, width:number},
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
      backgroundImage: {height:0, width:0},
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
      backgroundImage,
      posterImage,
    } = this.state

    const ctx = this.ctx
    if(ctx) {
      this.canvas.width = backgroundImage.width
      this.canvas.height = backgroundImage.height

      ctx.save()
      // ctx.scale(DPR, DPR)

      ctx.drawImage(this.getBackgroundImage(backgroundImageSrc), 0, 0)

      const imgs = this.getImages(imgSrcs)
      ctx.drawImage(imgs[0], 8, 207, 1063, 598)
      ctx.drawImage(this.getNo1Image(no1), 30, 207)

      ctx.drawImage(imgs[1], 8,   980, 259, 382)
      ctx.drawImage(imgs[2], 275, 980, 260, 382)
      ctx.drawImage(imgs[3], 542, 979, 260, 383)
      ctx.drawImage(imgs[4], 810, 980, 261, 382)

      ctx.font = '110px Bebas Neue'
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.fillText(titles[0], 540, 920 , 1080)
      //ctx.fillText(this.props.titles[0], this.state.backgroundImage.width/3 - 100, this.state.backgroundImage.height*2/3 + 50)

      ctx.font = '72px Bebas Neue'
      ctx.textAlign = "left"
      ctx.fillText(titles[1], 149, 1450, 900)
      ctx.fillText(titles[2], 163, 1540, 900)
      ctx.fillText(titles[3], 182, 1630, 900)
      ctx.fillText(titles[4], 198, 1720, 900)

      ctx.restore()

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
        backgroundImage: {height: img.height, width: img.width}
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
      // img.onload = () => {}

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

            <br/>

            <div>
              <button onClick={e => this.download()}><FontAwesomeIcon icon={faDownload}/> Save Image</button>
              {this.showShare()}
            </div>
        </div>
      </CustomContainer>
    )
  }
}
