export class WebComponent extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.shadowRoot.innerHTML = `
        <label for="input">JSX native event demo</label>
        <input type="text" id="input">`
    this.shadowRoot.querySelector('input').addEventListener('input', e => {
      const customEvent = new CustomEvent('custom-event', {
        detail: e.target.value
      })

      this.dispatchEvent(customEvent)
    })
  }
}

if (!customElements.get('web-component')) {
  customElements.define('web-component', WebComponent)
}
