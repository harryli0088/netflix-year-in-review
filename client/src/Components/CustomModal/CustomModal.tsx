import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import LoadingSpinner from "Components/LoadingSpinner/LoadingSpinner"
import "./customModal.scss"

type Props = {
  close: () => any,
  content: string | JSX.Element,
  showCloseButton: boolean,
  showLoadingSpinner: boolean,
  showModal: boolean,
}
export default function CustomModal(props:Props) {
  return (
    <div className={"customModal" + (props.showModal?" show":"")}>
      {props.showCloseButton && <div className="closeButton" onClick={e => props.close()}><FontAwesomeIcon icon={faTimes}/></div>}
      <div className="content">
        {props.showLoadingSpinner && <div><LoadingSpinner/></div>}
        <div>{props.content}</div>
      </div>
    </div>
  )
}
