import { LitElement, html, css } from 'lit-element';
import { openWcLogo } from './open-wc-logo.js';

// import '@material/mwc-list/mwc-list.js';
// import '@material/mwc-list/mwc-list-item.js';
import '@material/mwc-textfield';
import '@material/mwc-button';
import { parse } from './vcard';

export class AppCochrans extends LitElement {
 

  firstUpdated() {
    this.fn = this.shadowRoot.querySelector('[name="fn"]');
    this.adr_street = this.shadowRoot.querySelector('[name="adr_street"]')
    this.adr_locality = this.shadowRoot.querySelector('[name="adr_locality"]')
    this.adr_region = this.shadowRoot.querySelector('[name="adr_region"]')
    this.adr_code = this.shadowRoot.querySelector('[name="adr_code"]')
    this.adr_country = this.shadowRoot.querySelector('[name="adr_country"]')
    this.tel = this.shadowRoot.querySelector('[name="tel"]')
    this.email = this.shadowRoot.querySelector('[name="email"]')
 
    if (!('NDEFReader' in window)) {
      /* Scan NFC tags */ 
      window.alert("Browser does not support reading NFC tags")
    }
    if (!('NDEFWriter' in window)) {
      /* Write NFC tags */
      window.alert("Browser does not support writing NFC tags")
    }

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
        let vcard = parse(string)
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

  onSubmitClicked(event) {
    event.target.closest('form').requestSubmit()
  }

  onSubmit (event) {
    event.preventDefault();
    const form = event.target;
    const fields = [...form.children]
      .filter(child=>child.getAttribute('name'));
    const validity = fields.map(field=>field.reportValidity()).filter(value=>!value)
    if (validity.length) {
      window.alert("Invalid entries, please fix")
    }
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

  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
      contact: { type: String },
    };
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
        display: flex;
        flex-direction: column;
      }
    `;
  }

  render() {
    return html`
    <h3>Contact info</h3>

    <form
      @submit=${this.onSubmit}
    >
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
        icon="create"
        label="Edit Fields"
        @click="${this.onEditFields}"
      ></mwc-button>

      <mwc-button 
        icon="create"
        label="Save to Tag"
        @click="${this.onSubmitClicked}"
      ></mwc-button>
    </form>

    <pre>${this.contact}</pre>

        <p class="app-footer">
          &copy;2020 Jeff Laughlin
        </p>
    `;
  }
}
