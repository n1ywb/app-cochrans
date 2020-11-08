import { LitElement, html, css } from 'lit-element';
import { openWcLogo } from './open-wc-logo.js';

import '@material/mwc-textfield';
import '@material/mwc-button';
import { parse } from './vcard';
import './c-contact-form'
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';

export class AppCochrans extends LitElement {

  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
      contact: { type: String },
      user: { type: Object },
      path: { type: String },
    };
  }

  navigate(state, path) {
    this.state = state;
    this.path = path;
    history.pushState(state, '', path);
  }

  firstUpdated() {
    // this.route(window.location);

    window.addEventListener('popstate', event => {
      this.path = document.location.pathname;
      this.state = event.state;
    })

    this.path = document.location.pathname;

    window.firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
      } else {
        // No user is signed in.
      }
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
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
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
        @click="${()=>this.navigate(null, '/admin/checkin')}"
      ></mwc-button>

      <mwc-button 
        raised
        label="Manage Accounts" 
        @click="${()=>this.navigate(null, '/admin/accounts')}"
      ></mwc-button>

      <mwc-icon
        style="--mdc-icon-size: 64px;"
      >contactless</mwc-icon>
      Touch phone to NFC tag to read contact info
    `
    }
    else if (path == '/contacts') {
      return html`
      <h2>contact</h2>
      <mwc-list>
        <mwc-list-item>
          Jeff Laughlin
        </mwc-list-item>
      </mwc-list>
      <c-contact-form
        .fn="${'asdf'}"
      ></c-contact-form>
      `
    }
    else {
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
  }


  render() {
    return html`
      ${ this.route(this.path) }
      <p class="app-footer">
        &copy;2020 Jeff Laughlin
      </p>
    `;
  }
}
