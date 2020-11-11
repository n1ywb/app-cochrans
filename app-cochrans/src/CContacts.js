import { LitElement, html, css } from 'lit-element';

import '@material/mwc-fab/mwc-fab.js';
import '@material/mwc-icon/mwc-icon.js';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';
import dialogPolyfill from 'dialog-polyfill'

export class CContacts extends LitElement {
  static get properties() {
    return {
      contacts: { type: Array },
      dialogOpen: { type: Boolean }
    };
  }

  firstUpdated() {
    this.contactFormDialog = this.shadowRoot.querySelector('#contactFormDialog')
    dialogPolyfill.registerDialog(this.contactFormDialog)
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
    }

    dialog {
      max-height: 90vh;
    }
  `;

  render() {
    return html`
      <mwc-list>
        ${
          this.contacts && this.contacts.map(contact=>html`
            <mwc-list-item 
              hasMeta 
              @click="${()=>this.contactFormDialog.showModal()}"
            >
              <span>${contact.fn}</span>
              <mwc-icon slot="meta">edit</mwc-icon>
            </mwc-list-item>
          `)
        }
      </mwc-list>

      <mwc-fab 
        icon=add
        @click="${()=>this.contactFormDialog.showModal()}"
      ></mwc-fab>

      <dialog id=contactFormDialog>
        <c-contact-form
          .fn="${'asdf'}"
        ></c-contact-form>
      </dialog>
    `;
  }
}