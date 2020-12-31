import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faInfoCircle, faLink, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import CustomContainer from 'Components/CustomContainer/CustomContainer'
import Modal from 'react-bootstrap/Modal'
import NetflixLogo from 'Components/NetflixLogo'
import step1 from './step1.svg'
import step3 from './step3.svg'
import "./landing.scss"

type Props = {
  fileContentCallback: (content:string) => any,
}

interface State {
  status: string,
}

export default class Landing extends React.Component<Props,State> {
  state = {
    status: "",
  }

  uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    this.setState({
      status: "hahah..."
    })
    const file = e.target.files?.[0]
    if(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e?.target?.result
        if(content) {
          this.props.fileContentCallback(content.toString())
        }
      }
      reader.onerror = (err) => {
        this.setState({
          status: err.toString(),
        })
      }
      reader.readAsText(file)
      this.setState({
        status: "Loading..."
      })
    }
  }

  getModal = () => {
    if(this.state.status) {
      return (
        <Modal>
          <Modal.Header>
            <Modal.Title>{this.state.status}</Modal.Title>
          </Modal.Header>
        </Modal>
      )
    }
  }


  render() {
    return (
      <div id="landing">
        {this.getModal()}

        <CustomContainer>
          <header>
            <div className="navIconContainer">
              <div className="navIcon">
                <FontAwesomeIcon icon={faComments}/>
              </div>
              <div>Feedback</div>
              <div>Survey</div>
            </div>
            <NetflixLogo/>
            <div className="navIconContainer">
              <div className="navIcon">
                <FontAwesomeIcon icon={faInfoCircle}/>
              </div>
              <div>Design &</div>
              <div>Development</div>
            </div>
          </header>

          <section>
            <p><b>By Matthew Lau & Harry Li</b></p>
            <p>Description in progress</p>
          </section>

          <section>
            images
          </section>

          <section id="instructions">
            <p>INSTRUCTIONS:</p>

            <div className="stepContainer">
              <div className="stepContent">
                <div className="stepTitle">1. LOG IN TO NETFLIX</div>
                <p>If you are using a shared account, make sure you are logged into your specific profile</p>
              </div>

              <div className="stepIcon"><img src={step1} alt="step 1"/></div>
            </div>

            <div className="stepContainer">
              <div className="stepContent">
                <div className="stepTitle">2. CLICK HERE</div>
                <p>Links to official Netflix Viewing Activity log <a href="https:///www.netflix.com/viewingactivity" target="_blank" rel="noopener noreferrer">https:///www.netflix.com/viewingactivity</a></p>
              </div>

              <div className="stepIcon">
                <a href="https:///www.netflix.com/viewingactivity" target="_blank" rel="noopener noreferrer">
                  <div id="step2IconContainer">
                    <div id="step2Icon"><FontAwesomeIcon icon={faLink}/></div>
                    <div>Netflix viewing</div>
                    <div>activity URL</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="stepContainer">
              <div className="stepContent">
                <div className="stepTitle">3. Click "Download all"</div>
                <p>Scroll all the way to the bottom of the page and click on "Download All"</p>
              </div>

              <div className="stepIcon"><img src={step3} alt="step 3"/></div>
            </div>

            <div className="stepContainer">
              <div className="stepContent">
                <div className="stepTitle">4. UPLOAD .CSV FILE HERE</div>
              </div>

              <div className="stepIcon"></div>
            </div>
          </section>

          <section>
            <div id="uploadFileContainer">
              <label id="fileUploadButton" htmlFor="fileUpload">
                Tap to Upload <FontAwesomeIcon icon={faCloudUploadAlt}/>
              </label>
              <input id="fileUpload" type="file" onChange={this.uploadFile} accept=".csv" hidden/>
            </div>
          </section>
        </CustomContainer>
      </div>
    )
  }
}
