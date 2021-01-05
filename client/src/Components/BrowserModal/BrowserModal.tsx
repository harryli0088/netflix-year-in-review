import React, { useState } from 'react'
import { detect } from 'detect-browser'
import CustomModal from 'Components/CustomModal/CustomModal'

export default function BrowserModal() {
  const [ showModal, setShowModal ] = useState(true)

  if(showModal) {
    const browser = detect()

    if( //if this is firefox on android
      browser?.name?.toLowerCase().indexOf("firefox") !== -1
      && browser?.os?.toLowerCase().indexOf("android") !== -1
    ) {
      return (
        <CustomModal
          close={() => setShowModal(false)}
          content={(
            <div style={{padding: "1em"}}>
              <div>Firefox on Android doesn't reliably load images.</div>
              <br/>
              <div>For best results, we recommend using another browser or platform!</div>
              <br/>
              <div><button onClick={e => setShowModal(false)}>Got it</button></div>
            </div>
          )}
          showCloseButton={showModal}
          showLoadingSpinner={false}
          showModal={showModal}
        />
      )
    }
  }
  return null
}
