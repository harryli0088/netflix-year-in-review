import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faInfoCircle, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import CustomContainer from 'Components/CustomContainer/CustomContainer'
import NetflixLogo from 'Components/NetflixLogo/NetflixLogo'
import exampleTopX from './exampleTopX.png'
import step1 from './step1.svg'
import step2 from './step2.svg'
import step3 from './step3.svg'
import "./landing.scss"

type Props = {
  fileContentCallback: (content:string) => any,
  setStatus: (status:string, showCloseButton?:boolean, showLoadingSpinner?:boolean) => any
}

interface State {
}

export default class Landing extends React.Component<Props,State> {
  uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const file = e.target.files?.[0]
    if(file) { //if the file exists
      if(file.name.slice(file.name.length-4, file.name.length) === ".csv") { //if the file has a .csv extension
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e?.target?.result
          if(content) {
            this.props.fileContentCallback(content.toString())
          }
        }
        reader.onerror = (err) => {
          this.props.setStatus(err.toString(), true, false)
        }
        reader.readAsText(file)
        this.props.setStatus("Loading...")
      }
      else {
        this.props.setStatus("You must upload a .csv file", true, false)
      }
    }
    else {
      this.props.setStatus("No file was uploaded...", true, false)
    }
  }




  render() {
    return (
      <div id="landing">
        <CustomContainer>
          <header>
            <div className="navIconContainer">
              <a href="https://forms.gle/jKkPwzi5KPDgYaNC8" target="_blank" rel="noopener noreferrer">
                <div className="navIcon">
                  <FontAwesomeIcon icon={faComments}/>
                </div>
                <div>Feedback</div>
                <div>Survey</div>
              </a>
            </div>
            <NetflixLogo/>
            <div id="designDevelopmentContainer" className="navIconContainer">
              <div className="navIcon">
                <FontAwesomeIcon icon={faInfoCircle}/>
              </div>
              <div>Design &</div>
              <div>Development</div>
            </div>
          </header>

          <section style={{paddingLeft:"1em", paddingRight:"1em"}}>
            <p><b>By Matthew Lau & Harry Li</b></p>
            <p id="description">Inspired by  #SpotifyWrapped that subscribers get at the end of every  year, we wanted to create something similar for Netflix. We ar using the .csv viewing activity log from Netflix’s site with the help of “The Movie Database API”  As of January 1, 2020, we have created our first graphic in this project that shows your <b>Top 5 Shows of 2020</b>. Check it out!</p>
          </section>

          <section>
            <div id="exampleImages">
              <div className="aspectRatioContainer"><img src={exampleTopX} alt="Example Top 5 Result"/></div>

              <div id="moreComingSoon">MORE COMING SOON!</div>

              <div></div>
            </div>
          </section>

          <section id="instructions">
            <p id="instructionsHeading">Instructions: it only takes 4 easy steps!</p>

            <div className="stepContainer">
              <div className="stepIcon"><img src={step1} alt="step 1"/></div>

              <div className="stepContent">
                <div className="stepTitle">1. LOG IN TO NETFLIX</div>
                <p>If you are using a shared account, make sure you are logged into your specific profile</p>
              </div>
            </div>

            <div className="stepContainer">
              <div className="stepIcon">
                <a href="https:///www.netflix.com/viewingactivity" target="_blank" rel="noopener noreferrer">
                  <img src={step2} alt="step 2"/>
                </a>
              </div>

              <div className="stepContent">
                <div className="stepTitle">2. TAP HERE + HOLD --{">"} OPEN IN NEW TAB</div>
                <div>
                  <div>Links to official Netflix Activity Log (<a href="https:///www.netflix.com/viewingactivity" target="_blank" rel="noopener noreferrer">netflix.com/viewingactivity</a>)</div>
                  <div>**if using a smartphone, tap and HOLD link -{">"} open in New Tab**</div>
                </div>
              </div>
            </div>

            <div className="stepContainer">
              <div className="stepIcon"><img src={step3} alt="step 3"/></div>

              <div className="stepContent">
                <div className="stepTitle">3. Click "Download all"</div>
                <p>Scroll all the way to the bottom of the page and click on "Download All"</p>
              </div>
            </div>
          </section>

          <section>
            <div id="uploadFileContainer">
              <label id="fileUploadButton" htmlFor="fileUpload">
                <FontAwesomeIcon icon={faCloudUploadAlt}/> &nbsp;&nbsp; 4. Tap to Upload
              </label>
              <input id="fileUpload" type="file" onChange={this.uploadFile} accept=".csv" hidden/>
            </div>
          </section>
        </CustomContainer>
      </div>
    )
  }
}
