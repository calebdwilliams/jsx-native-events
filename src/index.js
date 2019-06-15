import React from 'react'

/**
 * Convert a string from camelCase to kebab-case
 * @param {string} string - The base string (ostensibly camelCase)
 * @return { string } - A kebab-case string
 */
const toKebabCase = string => string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
const listeners = Symbol('event listeners')

export function ink (type, props, ...children) {
  const newProps = { ...props }
  newProps.ref = (element) => {
    if (element) {
      if (props) {
        const keys = Object.keys(props)
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
            if (!element[listeners]) {
              element[listeners] = new Map()
            }
            if (!element[listeners].has(eventName)) {
              element.addEventListener(eventName, props[key])
              element[listeners].set(eventName, props[key])
            }
          })
      }
    }
  }

  return React.createElement.apply(null, [type, newProps, ...children])
}
