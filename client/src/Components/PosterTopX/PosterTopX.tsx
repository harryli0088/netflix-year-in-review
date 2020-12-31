import React from 'react'
import memoize from 'memoize-one'
import CustomContainer from 'Components/CustomContainer/CustomContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faShare } from '@fortawesome/free-solid-svg-icons'
import shareApi from "utils/shareApi"
import backgroundImageSrc from "./top5.jpg"
import "./posterTopX.scss"

const DPR = window.devicePixelRatio

export type PosterTopXRequiredProps = {
  align: string,
  imgSrc: string,
  titles: string[],
  year: number,
}

export type Props = PosterTopXRequiredProps

interface State {
  backgroundImage: {height:number, width:number},
  posterImage: {height:number, width:number},
  showShare: boolean,
}


const EXPECTED_IMAGE_DIMENSIONS = {
  height: 952,
  width: 998,
}

export default class PosterTopX extends React.Component<Props,State> {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  imgRef: React.RefObject<HTMLImageElement> = React.createRef()

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
      align,
      imgSrc,
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

      //crop a square from the image
      ctx.drawImage(
        this.getPosterImage(imgSrc),
        (
          align === "center"
          ? (posterImage.width - posterImage.height) / 2
          : posterImage.width - posterImage.height
        ),
        0,
        Math.min(posterImage.width, posterImage.height),
        Math.min(posterImage.width, posterImage.height),
        0,
        225,
        EXPECTED_IMAGE_DIMENSIONS.width,
        EXPECTED_IMAGE_DIMENSIONS.height,
      )

      ctx.font = '120px Bebas Neue'
      ctx.fillStyle = "white";
      ctx.fillText(this.props.titles[0], this.state.backgroundImage.width/3 - 100, this.state.backgroundImage.height*2/3 + 50)

      ctx.font = '80px Bebas Neue'
      titles.slice(1).forEach((t,i) => {
        if(ctx) {
          ctx.fillText(t, this.state.backgroundImage.width/3 - 100, this.state.backgroundImage.height*2/3 + 175 + 89*i)
        }
      })

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

  getPosterImage = memoize(
    (imgSrc: string) => {
      const img = new Image()
      img.src = imgSrc
      img.setAttribute('crossorigin', 'anonymous')
      img.onload = () => this.setState({
        posterImage: {height: img.height, width: img.width}
      })

      return img
    }
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
