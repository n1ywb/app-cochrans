import { LitElement, html, css } from 'lit-element';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';

export class CUsers extends LitElement {
  static get styles() {
    return css`...`
  }

  static get properties() {
    return { 
      db: Object,
      users: { type: Array }
    };
  }

  constructor() {
    super();
    this.users = []
  }

  firstUpdated () {
    this.db.collection('users').onSnapshot(collection => {
      const users = [];
      console.log(collection)
      collection.forEach(doc=>users.push(doc.data()))
      this.users = users
    })
  }

  render() {
    return html`
      <mwc-list>
        ${this.users.map(user => html`
          <mwc-list-item>${user.displayName} ${user.phoneNumber} ${user.email}</mwc-list-item>
        `)}
      </mwc-list>
        `
  }
}