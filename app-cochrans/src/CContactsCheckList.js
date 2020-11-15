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
          this._uidSnapshot = this.db
            .collection('users')
            .doc(uid)
            .collection('contacts')
            .onSnapshot(collection => {
              const contacts = [];
              collection.forEach(doc=>{
                contacts.push({
                  cid: doc.id,
                  ...doc.data()
                })
              })
              this.contacts = contacts;
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
    const {contact} = evt.detail;
    if (this.state === 'new') {
      this.db
        .collection('users')
        .doc(this.uid)
        .collection('contacts')
        .add(contact)
    }
    else if (this.state === 'edit') {
      this.db
        .collection('users')
        .doc(this.uid)
        .collection('contacts')
        .doc(this.cid)
        .set(contact)

    }
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