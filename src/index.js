import React from 'react'

/**
 * Convert a string from camelCase to kebab-case
 * @param {string} string - The base string (ostensibly camelCase)
 * @return { string } - A kebab-case string
 */
const toKebabCase = string => string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()

/** @type {Symbol} - Used to save reference to active listeners */
const listeners = Symbol('jsx-native-events/event-listeners')

const eventPattern = /^onEvent/

export default function jsx (type, props, ...children) {
  const newProps = { ...props }
  if (typeof type === 'string') {
    newProps.ref = (element) => {
      if (element) {
        if (props) {
          const keys = Object.keys(props)
          /** Get all keys that have the `onEvent` prefix */
          keys
            .filter(key => key.match(/^onEvent/))
            .map(key =>
              ({
                key,
                eventName: toKebabCase(
                  key.replace('onEvent', '')
                ).replace('-', '')
              })
            )
            .map(({ eventName, key }) => {
              /** Add the listeners Map if not present */
              if (!element[listeners]) {
                element[listeners] = new Map()
              }
  
              /** If the listener hasn't be attached, attach it */
              if (!element[listeners].has(eventName)) {
                element.addEventListener(eventName, props[key])
                /** Save a reference to avoid listening to the same value twice */
                element[listeners].set(eventName, props[key])
              }
            })
        }
      }
  }
  }

  // if (props) {
  //   const keys = Object.keys(props)
  //   const eventKeys = keys.filter(key => key.match(eventPattern))

  //   if (eventKeys.length) {
  //     const ref = React.createRef()
  //     newProps.ref = ref
  //     const element = React.createElement(type, ...newProps, ...children)
  //     eventKeys
  //       .map(key => ({
  //           key,
  //           eventName: toKebabCase(
  //             key.replace('onEvent', '')
  //           ).replace('-', '')
  //         })
  //       )
  //       .map(({ eventName, key }) => {
  //         console.log(ref)
  //         /** Add the listeners Map if not present */
  //         // if (!element[listeners]) {
  //         //   element[listeners] = new Map()
  //         // }
  //         /** If the listener hasn't be attached, attach it */
  //         // if (!element[listeners].has(eventName)) {
  //           ref.current.addEventListener(eventName, props[key])
  //           /** Save a reference to avoid listening to the same value twice */
  //           // element[listeners].set(eventName, props[key])
  //         // }
  //       })
  //     return active
  //   }
  // }
  
  

  return React.createElement.apply(null, [type, newProps, ...children])
}
