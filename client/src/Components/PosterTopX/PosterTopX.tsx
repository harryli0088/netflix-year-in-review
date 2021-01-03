import React from 'react'
import memoize from 'memoize-one'
import ImgFromCanvas from 'Components/ImgFromCanvas/ImgFromCanvas'
import { TOP_X, YEAR } from "consts"
import drawImage from "utils/drawImage"
import multilineFillText from "utils/multilineFillText"
import { YearDataMapType } from "utils/processCsvData"
// import shareApi from "utils/shareApi"
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

type Props = {
  yearDataMap: YearDataMapType
}


interface State {
  backgroundImgDims: {height:number, width:number},
  // showShare: boolean,
}


export default class PosterTopX extends React.Component<Props,State> {
  constructor(props:Props) {
    super(props)

    this.state = {
      backgroundImgDims: {height:0, width:0},
      // showShare: navigator.share !== undefined,
    }
  }

  componentDidMount() {
    this.forceUpdate()
  }

  processData = memoize(
    (yearDataMap: YearDataMapType):{imgSrcs: string[], titles: string[]} => {
      const data = yearDataMap.get(YEAR)
      if(data) {
        const serieData = Array.from(data.serie).sort(
          (a, b) => {
            if(a[1].score > b[1].score) return -1
            return 1
          }
        )
        console.log("serieData",serieData)

        const topXSeriesData = serieData.slice(0, TOP_X)

        return {
          imgSrcs: topXSeriesData.map(
            (d,i) => i===0 ? d[1].tmdbData.backdrop_path : d[1].tmdbData.poster_path
          ),
          titles: topXSeriesData.map(d => d[0]),
        }
      }

      return {imgSrcs: [], titles: []}
    }
  )

  canvasDrawCallback = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const { imgSrcs, titles } = this.processData(this.props.yearDataMap)

    const imgs = this.getImages(imgSrcs)

    ctx.font = '150px Bebas Neue'
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    multilineFillText(ctx, titles[0], IMG_BOUNDS[0].x, IMG_BOUNDS[0].y, IMG_BOUNDS[0].width, IMG_BOUNDS[0].height) //alt text
    drawImage( //main image
      ctx,
      imgs[0],
      IMG_BOUNDS[0].x,
      IMG_BOUNDS[0].y,
      IMG_BOUNDS[0].width,
      IMG_BOUNDS[0].height,
    )
    drawImage(ctx, this.getNo1Image(no1), 30, 207) //red #1 overlay

    ctx.font = '60px Bebas Neue'
    IMG_BOUNDS.slice(1).forEach((bounds,i) => {
      multilineFillText(ctx, titles[i+1], bounds.x+10, bounds.y+5, bounds.width-20, bounds.height-10) //alt text
      drawImage(ctx, imgs[i+1], bounds.x, bounds.y, bounds.width, bounds.height) //poster img
    })

    //main title
    ctx.font = '110px Bebas Neue'
    ctx.fillText(titles[0],540, 920,1040) //1040 adds some padding on both sides

    //2-5 show titles
    ctx.font = '72px Bebas Neue'
    ctx.textAlign = "left"
    ctx.fillText(titles[1], 149, 1450, 900)
    ctx.fillText(titles[2], 163, 1540, 900)
    ctx.fillText(titles[3], 182, 1630, 900)
    ctx.fillText(titles[4], 198, 1720, 900)
  }


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
      // img.src = `${SERVER_URL}/tmdbImg${imgSrc}`
      img.setAttribute('crossorigin', 'anonymous')
      img.onload = () => this.forceUpdate()

      return img
    })
  )

  // download = () => {
  //   const a = document.createElement("a")
  //   a.href = this.canvas.toDataURL("image/png")
  //   a.download = "Netflix_Year_In_Review_Top_5.png"
  //   a.click()
  // }

  // share = () => {
  //   this.canvas.toBlob((blob) => {
  //     if(blob) {
  //       shareApi(blob)
  //       // const dumb = async () => {
  //       //   if(await shareApi(blob) === false) {
  //       //     this.setState({showShare: true})
  //       //   }
  //       // }
  //       //
  //       // dumb()
  //     }
  //   })
  // }

  // showShare = () => {
  //   if(this.state.showShare) {
  //     return (
  //       <button onClick={e => this.share()}>
  //         <FontAwesomeIcon icon={faShare}/> Share
  //       </button>
  //     )
  //   }
  // }


  render() {
    return (
      <ImgFromCanvas backgroundImageSrc={backgroundImageSrc} canvasDrawCallback={this.canvasDrawCallback}/>
    )
  }
}
