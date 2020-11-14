import { LitElement, html, css } from 'lit-element';

import '@material/mwc-fab/mwc-fab.js';
import '@material/mwc-icon/mwc-icon.js';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';

export class CContacts extends LitElement {
  static get properties() {
    return {
      contacts: { type: Array },
      dialogOpen: { type: Boolean },
      user: { type: Object },
      db: { type: Object },
    };
  }

  firstUpdated() {
    this.contactFormDialog = this.shadowRoot.querySelector('c-contact-form');
  }

  saveContacts(evt) {
    let contacts;
    const {contact} = evt.detail;
    if (this.state === 'new')
      contacts = [...this.contacts, contact]
    else if (this.state === 'edit')
      contacts = [
        ...this.contacts.slice(0,this.editIndex), 
        contact, 
        ...this.contacts.slice(this.editIndex + 1)
      ]
    this.db.collection('users').doc(this.user.uid).update({
      contacts
    })
  }

  openNewContactDialog() {
    this.state = 'new';
    this.contactFormDialog.show({});
  }

  openEditContactDialog(contact, index) {
    this.state = 'edit';
    this.editIndex = index
    this.contactFormDialog.show(contact);
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
          this.contacts && this.contacts.map((contact, idx)=>html`
            <mwc-list-item 
              hasMeta 
              @click="${()=>this.openEditContactDialog(contact, idx)}"
            >
              <span>${contact.fn}</span>
              <mwc-icon slot="meta">edit</mwc-icon>
            </mwc-list-item>
          `)
        }
      </mwc-list>

      <mwc-fab 
        icon=add
        @click="${this.openNewContactDialog}"
      ></mwc-fab>

      <c-contact-form
        @save="${this.saveContacts}"
      ></c-contact-form>
    `;
  }
}