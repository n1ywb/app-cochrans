import { LitElement, html, css } from 'lit-element';

import '@material/mwc-fab/mwc-fab.js';
import '@material/mwc-icon/mwc-icon.js';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';

import { navigator } from 'lit-element-router';

export class CContacts extends navigator(LitElement) {
  static get properties() {
    return {
      contacts: { type: Array },
      uid: { type: String },
      db: { type: Object },
    };
  }

 updated(changedProps) {
    if (changedProps.has('uid') && this.uid && this.db) {
      this._uidSnapshot && this._uidSnapshot();
      setTimeout(
        () => {
          this._uidSnapshot = this.db
            .collection('users')
            .doc(this.uid)
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
  } 

  constructor() {
    super();
    this.uid = '';
  }

  firstUpdated() {
    this.contactFormDialog = this.shadowRoot.querySelector('c-contact-form');
  }

  saveContact(evt) {
    const {contact} = evt.detail;
    this.db
      .collection('users')
      .doc(this.uid)
      .collection('contacts')
      .add(contact)
  }

  openNewContactDialog() {
    this.contactFormDialog.show({});
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
      <h2>Contacts</h2>
      <mwc-list>
        ${
          this.contacts && this.contacts.map((contact, idx)=>html`
            <mwc-list-item 
              hasMeta 
              @click="${()=>this.navigate(`/users/${this.uid}/contacts/${contact.cid}`)}"
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
        @save="${this.saveContact}"
      ></c-contact-form>
   `;
  }
}