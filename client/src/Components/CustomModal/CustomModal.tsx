import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import "./customModal.scss"

type Props = {
  close: () => any,
  closeButton: boolean,
  content: string | JSX.Element,
  show: boolean,
}
export default (props:Props) => {
  return (
    <div className={"customModal" + (props.show?" show":"")}>
      {props.closeButton && <div className="closeButton" onClick={e => props.close()}><FontAwesomeIcon icon={faTimes}/></div>}
      <div className="content">{props.content}</div>
    </div>
  )
}
