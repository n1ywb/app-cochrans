import { LitElement, html, css } from 'lit-element';

import '@material/mwc-fab/mwc-fab.js';
import '@material/mwc-icon/mwc-icon.js';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-check-list-item.js';

export class CContactsCheckList extends LitElement {
  static get properties() {
    return {
      contacts: { type: Array },
      dialogOpen: { type: Boolean },
      uid: { type: String },
      db: { type: Object },
    };
  }

  set uid(uid) {
    const olduid = this._uid;
    this._uid = uid;
    this._uidSnapshot && this._uidSnapshot();
    if (uid) {
      setTimeout(
        () => {
          this._uidSnapshot = this.db.collection('users').doc(uid).onSnapshot(doc => {
            if (doc.exists) {
              this.contacts = doc.data().contacts;
            }
            else {
              this.db.collection('users').doc(uid).update({
                contacts: []
              });
            }
          })
        },
        0
      );
    }
    this.requestUpdate('uid', this._uid);
  }

  get uid() { return this._uid; }

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
    this.db.collection('users').doc(this.uid).update({
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

  onSelected(evt) {
    console.log(evt)
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
      <h2>My Contacts</h2>
      <mwc-list multi @selected=${this.onSelected}>
        ${
          this.contacts && this.contacts.map((contact)=>html`
            <mwc-check-list-item>
              <span>${contact.fn}</span>
            </mwc-check-list-item>
          `)
        }
      </mwc-list>

      <mwc-button 
        icon=add 
        label="Add somebody else"
        @click="${this.openNewContactDialog}"
      ></mwc-button>
 
      <c-contact-form
        @save="${this.saveContacts}"
      ></c-contact-form>
    `;
  }
}