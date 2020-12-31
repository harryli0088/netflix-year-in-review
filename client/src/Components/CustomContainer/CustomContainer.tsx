import React from 'react'

import "./customContainer.css"

type Props = {
  children: any,
}

export default (props:Props) => {
  return (
    <div className="customContainer">
      {props.children}
    </div>
  )
}
