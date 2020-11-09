import { LitElement, html, css } from 'lit-element';

import '@material/mwc-fab/mwc-fab.js';
import '@material/mwc-icon/mwc-icon.js';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';

export class CContacts extends LitElement {
  static get properties() {
    return {
      contacts: { type: Array },
      dialogOpen: { type: Boolean }
    };
  }

  firstUpdated() {
    this.contacts = [
      {fn: 'Jeff Laughlin'},
      {fn: 'James Laughlin'},
      {fn: 'Sofia Laughlin'},
      {fn: 'Joseph Laughlin'},
      {fn: 'Ania Laughlin'},
    ]

    this.contactFormDialog = this.shadowRoot.querySelector('#contactFormDialog')
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
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