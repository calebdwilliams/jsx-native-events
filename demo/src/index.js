/** @jsx nativeEvents */
import React, { useState } from 'react'
import { render } from 'react-dom'

import nativeEvents from '../../src'

import './web-component'

export default function SomeComponent (props) {
  const [ name, setName ] = useState('')

  return <div>
    <p>My name is {name}</p>

    <web-component
      onEventCustomEvent={ e => setName(e.detail) }
    ></web-component>
  </div>
}

render(<SomeComponent/>, document.querySelector('#demo'))
