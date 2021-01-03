import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import CustomContainer from 'Components/CustomContainer/CustomContainer'
import NetflixLogo from 'Components/NetflixLogo/NetflixLogo'
import './navBar.scss'

type Props = {
  showFeedback: boolean
}

export default function NavBar(props: Props) {
  return (
    <nav>
      <CustomContainer>
        <div id="navContainer">
          <div className="navIconContainer">
            {
              props.showFeedback && (
                <a href="https://forms.gle/jKkPwzi5KPDgYaNC8" target="_blank" rel="noopener noreferrer">
                  <div className="navIcon">
                    <FontAwesomeIcon icon={faComments}/>
                  </div>
                  <div>How'd</div>
                  <div>we do?</div>
                </a>
              )
            }
          </div>

          <NetflixLogo/>

          <div id="designDevelopmentContainer" className="navIconContainer">
            <div className="navIcon">
              <FontAwesomeIcon icon={faInfoCircle}/>
            </div>
            <div>Design &</div>
            <div>Development</div>
          </div>
        </div>
      </CustomContainer>
    </nav>
  )
}
