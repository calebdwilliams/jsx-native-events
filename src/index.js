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
          /** Map custom events as objects (must have onEvent prefix) */
          const events = Object.entries(props).filter(([k, v]) => k.match(eventPattern)).map(([k, v]) => ({ [k]: v }))
          /** Get only the complex props (objects and arrays) */
          const complexProps = Object.entries(props).filter(([k, v]) => typeof v === 'object').map(([k, v]) => ({ [k]: v }))

          // console.log(events, complexProps)

          for (const event of events) {
            const [key, impl] = Object.entries(event)[0]
            const eventName = toKebabCase(
              key.replace('onEvent', '')
            ).replace('-', '')

            /** Add the listeners Map if not present */
            if (!element[listeners]) {
              element[listeners] = new Map()
            }
            /** If the listener hasn't be attached, attach it */
            if (!element[listeners].has(eventName)) {
              element.addEventListener(eventName, impl)
              /** Save a reference to avoid listening to the same value twice */
              element[listeners].set(eventName, impl)
            }
          }

          for (const prop of complexProps) {
            const [key, value] = Object.entries(prop)[0]
            delete newProps[key] // remove the complex prop from props
            element[key] = value // assign the complex prop as property instead attribute
          }
        }
      }
    }
  }
  return React.createElement.apply(null, [type, newProps, ...children])
}
