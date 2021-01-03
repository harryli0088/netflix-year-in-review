import React from 'react'
import memoize from 'memoize-one'
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

  componentDidMount() {
    window.scrollTo(0,0) //scroll to the top of the screen
  }

  getPosterData = memoize(
    (yearDataMap:YearDataMapType) => ([
      {
        label: "Top 5",
        component: <PosterTopX yearDataMap={yearDataMap}/>,
      },
      {
        label: "Overview",
        component: <PosterOverview yearDataMap={yearDataMap}/>,
      },
    ])
  )

  render() {
    const {
      yearDataMap,
    } = this.props

    const {
      posterIndex,
    } = this.state

    const posters = this.getPosterData(yearDataMap)

    return (
      <div id="results">
        <CustomContainer>
          <div className="resultsContent">
            <div className="slideshowContainer">
              {posters.map((p,i) => {
                const focus = i === posterIndex
                return (
                  <div key={i} className={focus?"posterFade":""} style={{display: focus?"":"none"}}>{p.component}</div>
                )
              })}
            </div>
            <br/>

            {/* <div>
              <button onClick={e => this.download()}><FontAwesomeIcon icon={faDownload}/> Save Image</button>
              {this.showShare()}
            </div> */}
          </div>
        </CustomContainer>

        <div className="bottomBar">
          <CustomContainer>
            <div className="bottomBarContent">
              <button
                disabled={posterIndex <= 0}
                onClick={e => this.setState({posterIndex: Math.max(0, posterIndex-1)})}
              >
                <FontAwesomeIcon icon={faChevronLeft}/>
              </button>

              <div>
                <div><b>{posters[posterIndex].label} ({posterIndex+1}/{posters.length})</b></div>
                <div className="saveMessage">
                  <div><b>Save & Share on your social media with #nyir2020!</b></div>
                  <p>
                    <span className="mobileOnly">Tap + Hold image</span>
                    <span className="desktopOnly">Right Click -{">"} Save As...”</span>
                  </p>
                </div>
              </div>

              <button
                disabled={posterIndex >= posters.length-1}
                onClick={e => this.setState({posterIndex: Math.min(posters.length-1, posterIndex+1)})}
              >
                <FontAwesomeIcon icon={faChevronRight}/>
              </button>
            </div>
          </CustomContainer>
        </div>
      </div>
    )
  }
}
