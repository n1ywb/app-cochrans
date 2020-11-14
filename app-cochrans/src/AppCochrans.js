import { LitElement, html, css } from 'lit-element';
import { openWcLogo } from './open-wc-logo.js';

import '@material/mwc-textfield';
import '@material/mwc-button';
import { parse } from './vcard';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';
import '@material/mwc-list/mwc-check-list-item.js';
import dialogPolyfill from 'dialog-polyfill'

import './c-contact-form';
import './c-contacts';

export class AppCochrans extends LitElement {

  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
      contact: { type: String },
      user: { type: Object },
      db: { type: Object },
      path: { type: String },
      contacts: { type: Array },
    };
  }

  constructor() {
    super();
    this.contacts = []
  }

  navigate(state, path) {
    this.state = state;
    this.path = path;
    history.pushState(state, '', path);
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
          }
          else {
            this.db.collection('users').doc(user.uid).set({contacts: []});
          }
        })
      }, 1000);
    }
      
    this.requestUpdate('user', this._user);
  }

  get user() { return this._user; }

  firstUpdated() {
    this.path = document.location.pathname;

    // this.route(window.location);

    this.transientContacts = [];

    // this.contacts = [
    //   {fn: 'Jeff Laughlin'},
    //   {fn: 'James Laughlin'},
    //   {fn: 'Sofia Laughlin'},
    //   {fn: 'Joseph Laughlin'},
    //   {fn: 'Ania Laughlin'},
    // ]

    this.accounts = [
      {fn: 'Jeff Laughlin'},
      {fn: 'Robert Farrell'},
      {fn: 'Roger Brown'},
    ];

    [...this.shadowRoot.querySelectorAll('dialog')].map(dialog=>dialogPolyfill.registerDialog(dialog));

    window.addEventListener('popstate', event => {
      this.path = document.location.pathname;
      this.state = event.state;
    });

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
    `;
  }

  route (path) {
    if (path == '/') {
      return html`
      <p>Welcome, ${this.user?.displayName}</p>
      <p>Would you like to:</p>

      <mwc-button 
        raised
        label="Visit Today" 
        @click="${()=>this.navigate(null, '/visit')}"
      ></mwc-button>

      <mwc-button 
        raised
        label="Manage Contacts" 
        @click="${()=>this.navigate(null, '/contacts')}"
      ></mwc-button>

      <hr>
      <section>Admin</section>

      <mwc-button 
        raised
        label="Check Someone else in" 
        @click="${()=>this.navigate({}, '/admin/checkin')}"
      ></mwc-button>

      <mwc-button 
        raised
        label="Manage Accounts" 
        @click="${()=>this.navigate(null, '/admin/accounts')}"
      ></mwc-button>

      <mwc-button 
        raised
        label="Write NFC Tag" 
        @click="${()=>this.navigate(null, '/admin/writetag')}"
      ></mwc-button>

      <mwc-icon
        style="--mdc-icon-size: 64px;"
      >contactless</mwc-icon>
      Touch phone to NFC tag to read contact info
    `
    }
    if (path == '/contacts') {
      return html`
      <h2>My Contacts</h2>
      <c-contacts
        .contacts=${this.contacts}
        .user=${this.user}
        .db=${this.db}
      ></c-contacts>
      `
    }
    if (path == '/visit') {
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
    if (path == '/admin/checkin') {
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
    if (path == '/admin/accounts') {
      return html`
        <mwc-list>
          ${ this.accounts.map(account=>html`
            <mwc-list-item>${account.fn}</mwc-list-item>
          `)}
        </mwc-list>
      `;
    }
    
      return html`
        <h1>404 Page Not Found</h1>

        <mwc-button 
          raised
          label="Go Home" 
          @click="${()=>this.navigate(null, '/')}"
        ></mwc-button>

        <mwc-button 
          raised
          label="Go Back" 
          @click="${()=>history.back()}"
        ></mwc-button>
      `
    
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
      ${ this.route(this.path) }

      <dialog id=checkinDialog>
        <c-contact-form></c-contact-form>
        ${this.attest_text()}
      </dialog>

      <dialog id=attestThanks>
        <form method=dialog>
          <p>Thanks for submitting your attestation!</p>
          <mwc-button type=submit @click=${()=>this.navigate({}, '/')}>Go Home</mwc-button>
        </form>
      </dialog>

      <dialog id=newContact>
        <form method=dialog>
          <c-contact-form></c-contact-form>
          <mwc-button 
            type=submit 
            @click=${(e)=>e.target.closest('form').requestSubmit()}
          >Save</mwc-button>
          <mwc-button 
            type=cancel
            @click=${(e)=>e.target.closest('form').requestSubmit()}
          >Cancel</mwc-button>
        </form>
      </dialog>

      <p class="app-footer">
        &copy;2020 Jeff Laughlin
      </p>
    `;
  }
}
