import { LitElement, html, css } from 'lit-element';

import '@material/mwc-textfield';
import '@material/mwc-button';
import '@material/mwc-dialog/mwc-dialog.js';

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
    this.form = this.shadowRoot.querySelector('mwc-dialog');
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

  isValid() {
    const fields = [...this.form.children]
      .filter(child => child.getAttribute('name'));
    const validity = fields
      .map(field => field.reportValidity())
      .filter(value => !value)
    if (validity.length) {
      return false;
    }
    return true;
  }

  onSubmit() {
    if (!this.isValid()) {
      // window.alert("Invalid entries, please fix")
    }
    else {
      this.dispatchEvent(new CustomEvent('save', {bubbles: true, composed: true}));
      form.close();
    }
  }

  show(contact) {
    if (contact) {
      this.fn.value = contact.fn || '';
      this.adr_street.value = contact.adr_street || '';
      this.adr_locality.value = contact.adr_locality || '';
      this.adr_region.value = contact.adr_region || '';
      this.adr_code.value = contact.adr_code || '';
      this.adr_country.value = contact.adr_country || '';
      this.tel.value = contact.tel || '';
      this.email.value = contact.email || '';
     }
    this.shadowRoot.querySelector('mwc-dialog').show();
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
      }

      mwc-dialog {
        display: flex;
        flex-direction: column;
      }
    `;
  }

  render() {
    return html`
      <mwc-dialog>
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
          type=submit 
          @click="${()=>this.onSubmit()}"
          slot=primaryAction
        >Save</mwc-button>

        <mwc-button 
          type=cancel
          slot=secondaryAction
          dialogAction="close"
        >Cancel</mwc-button>
      </mwc-dialog>
    `;
  }
}