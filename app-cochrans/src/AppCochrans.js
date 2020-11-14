import { LitElement, html, css } from 'lit-element';
import { openWcLogo } from './open-wc-logo.js';

import '@material/mwc-textfield';
import '@material/mwc-button';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';
import '@material/mwc-list/mwc-check-list-item.js';
import dialogPolyfill from 'dialog-polyfill'
import { router, navigator , outlet } from 'lit-element-router';


import './c-contact-form';
import './c-contacts';
import './c-users';


import { parse } from './vcard';
 
// @outlet
class Main extends outlet(LitElement) {
  render() {
    return html`
      <slot></slot>
    `;
  }
}
 
customElements.define('app-main', Main);


// @router
// @navigator
export class AppCochrans extends router(navigator(LitElement)) {

  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
      contact: { type: String },
      db: { type: Object },
      user: { type: Object },
      contacts: { type: Array },
      params: { type: Object },
      query: { type: Object },
      route: { type: String, reflect: true, attribute: 'route' },
      canceled: { type: Boolean },
    };
  }

  static get routes() {
    return [{
      name: 'home',
      pattern: '',
      data: { title: 'Home' }
    },
    {
      name: 'contacts',
      pattern: 'contacts'
    },
    {
      name: 'visit',
      pattern: 'visit'
    },
    {
      name: 'checkin',
      pattern: 'admin/checkin'
    },
    {
      name: 'adminUsers',
      pattern: 'admin/users'
    },
    {
      name: 'adminUsersUid',
      pattern: 'admin/users/:uid'
    },
    {
      name: 'not-found',
      pattern: '*'
    }];
  }

  constructor() {
    super();
    this.contacts = []
    this.transientContacts = []
  }

  router(route, params, query, data) {
    this.route = route;
    this.params = params;
    this.query = query;
    console.log(route, params, query, data);
  }

  set user(user) {
    const oldUser = this._user;
    this._user = user;
    if (user) {
      // User is signed in.
      setTimeout(()=>{
        this.db.collection('users').doc(user.uid).onSnapshot(doc=>{
          if (doc.exists) {
            this.contacts = doc.data().contacts;
            this.db.collection('users').doc(user.uid).update({
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              photoURL: user.photoURL
            })
          }
          else {
            this.db.collection('users').doc(user.uid).set({
              contacts: [],
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              photoURL: user.photoURL
            });
          }
        })
      }, 1000);
    }
      
    this.requestUpdate('user', this._user);
  }

  get user() { return this._user; }

  firstUpdated() {
    this.transientContacts = [];

    if (!('NDEFReader' in window)) {
      /* Scan NFC tags */ 
      // window.alert("Browser does not support reading NFC tags")
      console.warn("Browser does not support reading NFC tags")
    }
    else {
      const reader = new NDEFReader();
      reader.scan().then(() => {
        console.log("Scan started successfully.");
        reader.onerror = () => {
          console.log("Cannot read data from the NFC tag. Try another one?");
        };
        reader.onreading = event => {
          console.log("NDEF message read.", event);
          const info = event.message.records[0].data.buffer
          const string = new TextDecoder("utf-8").decode(info)
          console.log("contact: ", string)
          this.contact = string;
          const vcard = parse(string)
          console.log("vcard: ", vcard)
          this.fn.value = vcard.fn[0].value
          this.adr_street.value = vcard.adr[0].value[2]
          this.adr_locality.value = vcard.adr[0].value[3]
          this.adr_region.value = vcard.adr[0].value[4]
          this.adr_code.value = vcard.adr[0].value[5]
          this.adr_country.value = vcard.adr[0].value[6]
          this.tel.value = vcard.tel[0].value
          this.email.value = vcard.email[0].value
        };
      }).catch(error => {
        console.log(`Error! Scan failed to start: ${error}.`);
      });
    }

    if (!('NDEFWriter' in window)) {
      /* Write NFC tags */
      console.warn("Browser does not support writing NFC tags")
    }

  }

  onSubmit (event) {
    const entries = fields.map(child=>
        [child.getAttribute('name'), child.value]
      )
    const obj = Object.fromEntries(entries)
    const vcard = `BEGIN:VCARD
VERSION:4.0
FN:${obj.fn}
TEL:VALUE=uri:tel:${obj.tel}
ADR:;;${obj.adr_street};${obj.adr_locality};${obj.adr_region};${obj.adr_code};${obj.adr_country}
EMAIL:${obj.email}
END:VCARD`.replace('\n', '\r\n');
    const encoder = new TextEncoder();
    const writer = new NDEFWriter();
    writer.write({records: [
      { recordType: "mime", mediaType: "text/vcard", data: encoder.encode(vcard) }
    ]})
      .then(()=>window.alert("Write successful"))
      .catch(err=>window.alert(`Write failed: ${err}`))
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: left;
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }

      .image-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }

      image-list-item {
        flex-grow: 0;
      }

      form {
      }

      mwc-button {
        padding: 8px;
      }

      dialog {
        max-height: 80vh;
        overflow: auto;
      }

      div {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `;
  }

  viewHome() {
    return html`
      <p>Welcome, ${this.user?.displayName}</p>
      <p>Would you like to:</p>

      <mwc-button 
        raised
        label="Visit Today" 
        @click="${()=>this.navigate('/visit')}"
      ></mwc-button>

      <mwc-button 
        raised
        label="Manage Contacts" 
        @click="${()=>this.navigate('/contacts')}"
      ></mwc-button>

      <hr>
      <section>Admin</section>

      <mwc-button 
        raised
        label="Check Someone else in" 
        @click="${()=>this.navigate('/admin/checkin')}"
      ></mwc-button>

      <mwc-button 
        raised
        label="Manage Users" 
        @click="${()=>this.navigate('/admin/users')}"
      ></mwc-button>

      <mwc-button 
        raised
        label="Write NFC Tag" 
        @click="${()=>this.navigate('/admin/writetag')}"
      ></mwc-button>

      <mwc-icon
        style="--mdc-icon-size: 64px;"
      >contactless</mwc-icon>
      Touch phone to NFC tag to read contact info
    `
  }

  viewVisit() {
    return html`
      Who is with you today, ${(new Date()).toDateString()}?
      <mwc-list multi>
        ${this.contacts.map(contact => html`
          <mwc-check-list-item>${contact.fn}</mwc-check-list-item>
        `)}
      </mwc-list>
      <mwc-button 
        icon=add 
        label="Add somebody else"
        @click="${()=>this.shadowRoot.querySelector('dialog#newContact').showModal()}"
      ></mwc-button>
      Each member of your party must attest that the following statements are true as read by them:
      <div style='text-align: left;'>
        ${this.attest_text()}
      </div>
      <mwc-button 
        raised 
        type=submit 
        @click="${()=>this.shadowRoot.querySelector('#attestThanks').showModal()}"
      >Attest</mwc-button>
    `;
  }

  viewCheckin() {
    return html`
      Who is with you today, ${(new Date()).toDateString()}?
      <mwc-list multi>
        ${this.transientContacts.map(contact => html`
          <mwc-check-list-item>${contact.fn}</mwc-check-list-item>
        `)}
      </mwc-list>
      <mwc-button 
        icon=add 
        label="Add somebody else"
        @click="${()=>this.shadowRoot.querySelector('dialog#newContact').showModal()}"
      ></mwc-button>
      Each member of your party must attest that the following statements are true as read by them:
      <div style='text-align: left;'>
        ${this.attest_text()}
      </div>
      <mwc-button 
        raised 
        type=submit 
        @click="${()=>this.shadowRoot.querySelector('#attestThanks').showModal()}"
      >Attest</mwc-button>
    `;
  }

  attest_text() {
    return html`
      <ul>
        <li>In the past 14 days I have not had close contact with a person confirmed to have COVID-19.</li>
        <li>I am in compliance with the state’s travel and quarantine policies.</li>
        <li>Today, or in the past 24 hours I have not had any of the following symptoms:</li>
        <ul>
          <li>Fever (>100.4°F or greater) or chills</li>
          <li>Cough</li>
          <li>Shortness of breath or difficulty breathing</li>
          <li>Fatigue</li>
          <li>Muscle or body aches</li>
          <li>Headache</li>
          <li>New loss of Taste or Smell</li>
          <li>Sore throat</li>
          <li>Congestion or runny nose</li>
          <li>Nausea or vomiting</li>
          <li>Diarrhea</li>
        </ul>
        <li>I understand that failure to provide accurate information may result in loss of skiing and riding privileges.</li>
      </ul>
    `
  }

  render() {
    return html`
      <app-main active-route=${this.route}>

        <div route='home'>${this.viewHome()}</div>

        <c-contacts
          route='contacts'
          .db=${this.db}
          .user=${this.user}
          .contacts=${this.contacts}
        ></c-contacts>

        <div route='visit'>${this.viewVisit()}</div>

        <div route='adminCheckin'>${this.viewCheckin()}</div>

        <c-users
          route='adminUsers'
          .db=${this.db}
          .user=${this.user}
        ></c-users>
 
        <div route=not-found>
          <h1>404 Page Not Found</h1>

          <mwc-button 
            raised
            label="Go Home" 
            @click="${()=>this.navigate('/')}"
          ></mwc-button>

          <mwc-button 
            raised
            label="Go Back" 
            @click="${()=>history.back()}"
          ></mwc-button>
        </div>
      </app-main>

      <dialog id=checkinDialog>
        <c-contact-form></c-contact-form>
        ${this.attest_text()}
      </dialog>

      <mwc-dialog id=attestThanks>
        <form method=dialog>
          <p>Thanks for submitting your attestation!</p>
          <mwc-button type=submit @click=${()=>this.navigate('/')}>Go Home</mwc-button>
        </form>
      </mwc-dialog>

      <p class="app-footer">
        &copy;2020 Jeff Laughlin
      </p>
    `;
  }
}
