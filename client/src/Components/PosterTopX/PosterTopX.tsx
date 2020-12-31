import React from 'react'
import memoize from 'memoize-one'
import CustomContainer from 'Components/CustomContainer/CustomContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faShare } from '@fortawesome/free-solid-svg-icons'
import shareApi from "utils/shareApi"
import backgroundImageSrc from "./top5.jpg"
import "./posterTopX.scss"

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

export default class PosterTopX extends React.Component<Props,{}> {
  canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()
  ctx?: CanvasRenderingContext2D | null

  state = {
    backgroundImage: {height:0, width:0},
    posterImage: {height:0, width:0},
    showShare: navigator.share !== undefined,
  }

  componentDidMount() {
    if(this.canvasRef.current) {
      this.ctx = this.canvasRef.current.getContext('2d')
      this.forceUpdate()
    }
  }

  componentDidUpdate() {
    const {
      align,
      imgSrc,
      titles,
      year,
    } = this.props

    const {
      posterImage,
    } = this.state

    const ctx = this.ctx
    if(ctx) {
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
    if(this.canvasRef.current) {
      const a = document.createElement("a")
      a.href = this.canvasRef.current.toDataURL("image/png")
      a.download = "Netflix_Year_In_Review_Top_5.png"
      a.click()
    }
  }

  share = () => {
    if(this.canvasRef.current) {
      this.canvasRef.current.toBlob((blob) => {
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
            <canvas ref={this.canvasRef} width={this.state.backgroundImage.width} height={this.state.backgroundImage.height}/>

            <div>
              <button onClick={e => this.download()}><FontAwesomeIcon icon={faDownload}/> Save Image</button>
              {this.showShare()}
            </div>
        </div>
      </CustomContainer>
    )
  }
}
