import React from 'react'
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
    return (
      <CustomContainer>
        <div id="results">
          <PosterOverview yearDataMap={this.props.yearDataMap}/>
          <PosterTopX yearDataMap={this.props.yearDataMap}/>
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
