import React from 'react'
import NetflixLogo from 'Components/NetflixLogo'
import "./landing.scss"

type Props = {
  fileContentCallback: (content:string) => any,
}

export default class Landing extends React.Component<Props,{}> {

  uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e?.target?.result
        if(content) {
          this.props.fileContentCallback(content.toString())
        }
      }
      reader.readAsText(file)
    }
  }


  render() {
    return (
      <div id="landing">
        <header>
          <div>Survey</div>
          <NetflixLogo/>
          <div>Design</div>
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
            <div className="step">STEP 1</div>

            <div className="stepContent">
              <div className="stepTitle">LOG IN TO NETFLIX</div>
              <p>If you are using a shared account, make sure you are logged into your specific profile</p>
            </div>

            <div className="stepIcon">icon</div>
          </div>

          <div className="stepContainer">
            <div className="step">STEP 2</div>

            <div className="stepContent">
              <div className="stepTitle">CLICK HERE</div>
              <p>Links to official Netflix Viewing Activity log <a href="https:///www.netflix.com/viewingactivity" target="_blank" rel="noopener noreferrer">https:///www.netflix.com/viewingactivity</a></p>
            </div>

            <div className="stepIcon">icon</div>
          </div>

          <div className="stepContainer">
            <div className="step">STEP 3</div>

            <div className="stepContent">
              <div className="stepTitle">Click "Download all"</div>
              <p>Scroll all the way to the bottom of the page and click on "Download All"</p>
            </div>

            <div className="stepIcon">icon</div>
          </div>

          <div className="stepContainer">
            <div className="step">STEP 4</div>

            <div className="stepContent">
              <div className="stepTitle">UPLOAD .CSV FILE HERE</div>
            </div>

            <div className="stepIcon">icon</div>
          </div>
        </section>

        <section>
          <div id="uploadFileContainer">
            <label id="fileUploadButton" htmlFor="fileUpload">
              Upload CSV File
            </label>
            <input id="fileUpload" type="file" onChange={this.uploadFile} accept=".csv" hidden/>
          </div>
        </section>
      </div>
    )
  }
}
