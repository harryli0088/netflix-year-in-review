import React from 'react'
import memoize from 'memoize-one'
import CustomContainer from 'Components/CustomContainer/CustomContainer'
import PosterTopX, { PosterTopXProps } from 'Components/PosterTopX/PosterTopX'
import "./results.scss"


type Props = {
  topXData: PosterTopXProps,
}

interface State {
}


export default class Results extends React.Component<Props,State> {
  constructor(props:Props) {
    super(props)
  }

  render() {
    return (
      <CustomContainer>
        <div id="results">
          <PosterTopX {...this.props.topXData}/>
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
