import React from 'react'

import "./customContainer.scss"

type Props = {
  children: any,
}

export default function CustomContainer(props:Props) {
  return (
    <div className="customContainer">
      <div className="customContainerContent">
        {props.children}
      </div>
    </div>
  )
}
