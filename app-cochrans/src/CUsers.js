import { LitElement, html, css } from 'lit-element';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-list/mwc-list-item.js';

import { navigator } from "lit-element-router";

export class CUsers extends navigator(LitElement) {
  static get styles() {
    return css`...`
  }

  static get properties() {
    return { 
      db: Object,
      users: { type: Object }
    };
  }

  constructor() {
    super();
    this.users = {};
  }

  firstUpdated () {
    this.db.collection('users').onSnapshot(collection => {
      const users = {};
      console.log(collection)
      collection.forEach(doc=>{
        const user = doc.data();
        users[user.uid] = user;
      })
      this.users = users
    })
  }

  render() {
    return html`
      <mwc-list>
        ${[...Object.values(this.users)].map(user => html`
          <mwc-list-item
            @click=${()=>this.navigate(`/admin/users/${user.uid}`)}
          >${user.displayName} ${user.phoneNumber} ${user.email}</mwc-list-item>
        `)}
      </mwc-list>
        `
  }
}