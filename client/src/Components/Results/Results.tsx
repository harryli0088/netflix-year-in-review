import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import CustomContainer from 'Components/CustomContainer/CustomContainer'
import PosterOverview from 'Components/PosterOverview/PosterOverview'
import PosterTopX from 'Components/PosterTopX/PosterTopX'
import { YearDataMapType } from "utils/processCsvData"
import "./results.scss"


type Props = {
  yearDataMap: YearDataMapType,
}

interface State {
  posterIndex: number,
}


export default class Results extends React.Component<Props,State> {
  constructor(props:Props) {
    super(props)

    this.state = {
      posterIndex: 0,
    }
  }

  render() {
    const {
      posterIndex,
    } = this.state

    const posters = [
      <PosterOverview yearDataMap={this.props.yearDataMap}/>,
      <PosterTopX yearDataMap={this.props.yearDataMap}/>,
    ]

    return (
      <CustomContainer>
        <div id="results">
          <div className="slideshowContainer">
            {posters.map((p,i) => {
              const focus = i === posterIndex
              return (
                <div key={i} className={focus?"posterFade":""} style={{display: focus?"":"none"}}>{p}</div>
              )
            })}
          </div>
          <br/>
          <div>
            <button
              disabled={posterIndex <= 0}
              onClick={e => this.setState({posterIndex: Math.max(0, posterIndex-1)})}
            >
              <FontAwesomeIcon icon={faChevronLeft}/>
            </button>

            <button
              disabled={posterIndex >= posters.length-1}
              onClick={e => this.setState({posterIndex: Math.min(posters.length-1, posterIndex+1)})}
            >
              <FontAwesomeIcon icon={faChevronRight}/>
            </button>
          </div>
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
