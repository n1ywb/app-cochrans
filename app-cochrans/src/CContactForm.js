import { LitElement, html, css } from 'lit-element';

import '@material/mwc-textfield';
import '@material/mwc-button';

export class CContactForm extends LitElement {
  static get properties() {
    return {
      fullname: { type: String },
      address_street: { type: String },
      address_locality: { type: String },
      address_region: { type: String },
      address_code: { type: String },
      address_country: { type: String },
      telephone: { type: String },
      email: { type: String },
    };
  }

  firstUpdated() {
    this.fn = this.shadowRoot.querySelector('[name="fn"]');
    this.adr_street = this.shadowRoot.querySelector('[name="adr_street"]')
    this.adr_locality = this.shadowRoot.querySelector('[name="adr_locality"]')
    this.adr_region = this.shadowRoot.querySelector('[name="adr_region"]')
    this.adr_code = this.shadowRoot.querySelector('[name="adr_code"]')
    this.adr_country = this.shadowRoot.querySelector('[name="adr_country"]')
    this.tel = this.shadowRoot.querySelector('[name="tel"]')
    this.email = this.shadowRoot.querySelector('[name="email"]')
  }

  onSubmitClicked(event) {
    event.target.closest('form').requestSubmit()
  }

  onSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const fields = [...form.children]
      .filter(child => child.getAttribute('name'));
    const validity = fields.map(field => field.reportValidity()).filter(value => !value)
    if (validity.length) {
      window.alert("Invalid entries, please fix")
    }
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
      }

      form {
        display: flex;
        flex-direction: column;
      }
    `;
  }

  render() {
    return html`
      <form
        @submit=${this.onSubmit}
      >
        <mwc-textfield
          required
          label="Full Name"
          name="fn"
        ></mwc-textfield>

        <mwc-textfield
          required
          label="Address"
          name=adr_street
        ></mwc-textfield>

        <mwc-textfield
          required
          label="City"
          name=adr_locality
        ></mwc-textfield>

        <mwc-textfield
          required
          label="State"
          name=adr_region
        ></mwc-textfield>

        <mwc-textfield
          required
          label="Postal Code"
          name=adr_code
        ></mwc-textfield>

        <mwc-textfield
          required
          label="Country"
          name=adr_country
        ></mwc-textfield>

        <mwc-textfield
          required
          label="Phone"
          type="tel"
          name="tel"
        ></mwc-textfield>

        <mwc-textfield
          required
          label="Email"
          type="email"
          name="email"
        ></mwc-textfield>

        <mwc-button 
          icon="create"
          label="Edit Fields"
          @click="${this.onEditFields}"
        ></mwc-button>

        <mwc-button 
          icon="create"
          label="Save to Tag"
          @click="${this.onSubmitClicked}"
        ></mwc-button>
      </form>

      <pre>${this.contact}</pre>
    `;
  }
}