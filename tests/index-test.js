/** @jsx nativeEvents */
import expect from 'expect'
import React from 'react'
import { unmountComponentAtNode } from 'react-dom'
import { render, fireEvent } from '@testing-library/react'

import nativeEvents from 'src/'

function callback (value) { return value }
const mocks = { callback }

export default function Component () {
  function dispatch ({ target, value }) {
    target.dispatchEvent(new CustomEvent('some-event', {
      detail: value
    }))
  }

  return <div>
    <input onChange={dispatch} onEventSomeEvent={mocks.callback} />
  </div>
}

describe('The nativeEvents pragma', () => {
  let node

  beforeEach(() => {
    expect.spyOn(mocks, 'callback')
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('displays a welcome message', () => {
    const { baseElement } = render(<Component />)

    const input = baseElement.querySelector('input')

    input.value = 'abc123'
    fireEvent.change(input)

    expect(mocks.callback).toHaveBeenCalled()
  })
})
