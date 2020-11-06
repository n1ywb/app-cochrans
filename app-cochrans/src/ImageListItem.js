import { LitElement, html, css } from 'lit-element';
import 'iron-swipeable-pages/iron-swipeable-pages.js';
import '@material/mwc-icon-button/mwc-icon-button.js';

export class ImageListItem extends LitElement {
    constructor() {
        super();
    }

    firstUpdated(changedProperties) {
        this.expanded = false;
        this.expandoContainer = this.shadowRoot.querySelector('.expando-container')
        this.infoContainer = this.shadowRoot.querySelector('.info-container')
        this.image = this.shadowRoot.querySelector('img')
        this.imageContainer = this.shadowRoot.querySelector('.image-container')
        this.zoomIcon = this.shadowRoot.querySelector('mwc-icon-button[icon=open_in_full]')
        // this.pages = this.shadowRoot.querySelector('iron-swipeable-pages');
        this.expandoContainer.addEventListener("transitionend", this.transitionEnd.bind(this));
        this.addEventListener('click', this.handleClick);
        // window.requestAnimationFrame(()=>{
            // this.shadowRoot.querySelector('mwc-icon-button[icon=clear]').style.transition = 'opacity 0.5s';
        // })
    }

    reset () {
        window.clearTimeout(this.resetHandle)
        // this.infoContainer.style.opacity = 0;
        this.expandoContainer.style.transition = '';
        this.expandoContainer.style.zIndex = '';
        this.expandoContainer.style.position = 'initial';
        this.expandoContainer.style.top = 'initial';
        this.expandoContainer.style.left = 'initial';
        this.expandoContainer.style.width = '100%';
        this.expandoContainer.style.height = '100%';
        document.querySelector('body').style.height = '';
        document.querySelector('body').style.overflow = '';
        this.expanded = false;
        this.collapsing = false;
        this.addEventListener('click', this.handleClick);
    }

    transitionEnd(evt) {
        if (evt.target === this.expandoContainer) {
            if (this.collapsing) {
                this.reset()
            }
        }
    }

    // <div class=swipe-container>
    //     <mwc-icon-button icon=swipe @click=${this.next}></mwc-icon-button>
    //     <div>Swipe to next page</div>
    // </div>

    zoom() {
        this.imageContainer.setAttribute('zoomed', '')
        this.imageContainer.scrollIntoView()
        this.zoomIcon.style.opacity = 0;
        this.zoomed = true;
    }

    close() {
        if (this.zoomed) {
            this.zoomed = false;
            this.zoomIcon.style.opacity = 1;
            this.imageContainer.removeAttribute('zoomed')
            return;
        }
        window.clearTimeout(this.resetHandle)
        if (this.expanded) {
            this.zoomIcon.style.opacity = 0;
            this.expanded = false;
            this.collapsing = true;
            // this.pages.selected = 0;
            this.resetHandle = window.setTimeout(()=>this.reset(), 1600)
            // this.image.style.maxWidth = '200%'
            // this.infoContainer.style.transition = 'opacity 0.5s ease-in';
            // this.infoContainer.style.opacity = 0;
            this.expandoContainer.style.zIndex = 9998;
            this.expandoContainer.style.transition = 'top 0.5s, left 0.5s, height 0.5s, width 0.5s'
            window.requestAnimationFrame(()=>{
                this.expandoContainer.style.top = `${this.expando_rect.top  }px`;
                this.expandoContainer.style.left = `${this.expando_rect.left  }px`;
                this.expandoContainer.style.height = `${this.expando_rect.height  }px`;
                this.expandoContainer.style.width = `${this.expando_rect.width  }px`;
            })
         }
    }

    handleClick(evt) {
        window.clearTimeout(this.resetHandle)
        if (!this.expanded) {
            this.removeEventListener('click', this.handleClick);
            this.expanded = true;
            window.requestAnimationFrame(()=>{
                if (!this.collapsing) {
                    this.expando_rect = this.expandoContainer.getBoundingClientRect();
                }
                this.collapsing = false;
                document.querySelector('body').style.height = '100%';
                document.querySelector('body').style.overflow = 'hidden';
                this.expandoContainer.style.position = 'fixed'
                this.expandoContainer.style.top = `${this.expando_rect.top  }px`;
                this.expandoContainer.style.left = `${this.expando_rect.left  }px`;
                this.expandoContainer.style.height = `${this.expando_rect.height  }px`;
                this.expandoContainer.style.width = `${this.expando_rect.width  }px`;
                this.expandoContainer.style.zIndex = 9999;
                window.requestAnimationFrame(()=>{
                    this.expandoContainer.style.transition = 'top 0.5s, left 0.5s, height 0.5s, width 0.5s'
                    this.expandoContainer.style.top = '0px';
                    this.expandoContainer.style.left = '0px';
                    // this.expandoContainer.style.height = window.innerHeight + 'px';
                    // this.expandoContainer.style.width = window.innerWidth + 'px';
                    this.expandoContainer.style.height = '100vh'
                    this.expandoContainer.style.width = '100vw'
                    // this.image.style.maxWidth = '100%'
                    // this.infoContainer.style.transition = 'opacity 0.5s ease-out 1s';
                    // this.infoContainer.style.opacity = 1;
                    this.zoomIcon.style.opacity = 1;
                })
            })
        }
    }

    static get properties() {
        return {
            title: {type: String},
            src: {type: String},
            expanded: {type: Boolean, reflect: true},
            tackle: {type: Array},
            lures: {type: Array},
            notes: {type: Array},
        }
    }

    static get styles() {
        return css`
            :host {
                display: flex;
                box-sizing: border-box;
                /* border-radius: 0 0 8px 8px; */
                margin: 2px;
                justify-content: right;
                background: white;
                overflow: hidden;
                position: relative;
                height: 256px;
                width: 98vw;
                transition: width 0.5s, height 0.5s;
            }

            :host([expanded]) .content-container {
                overflow: auto;
            }

            *, *:before, *:after {
              box-sizing: inherit;
            }

            .title-container {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 48px;
                line-height: 24px;
                display: flex;
                align-text: center;
                padding: 0 16px;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,.6);
                color: #fff;
            }

            .title {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                font-size: 1rem;
                line-height: 1.75rem;
                font-weight: 400;
                letter-spacing: .009375em;
                text-decoration: inherit;
                text-transform: inherit;
            }

            .expando-container {
                position: relative;
                display: flex;
                height: 100%;
                width: 100%;
                background: white;
                justify-content: start;
                flex-wrap: wrap;
                overflow: hidden;
            }

            .content-container {
                height: 100vh;
                width: 100vw;
                display: flex;
                flex-direction: column;
                justify-content: start;
                overflow: hidden;
                position: absolute;
                top: 0;
                left: 0;
            }

            img {
                height: 100%;
                width: 100%;
                object-fit: contain; 
                padding: 0 2vw 0 2vw;
            }

            .info-container {
                flex-grow: 1;
            }

            .image-container {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 256px;
                position: relative;
                background: white;
                transition: top 0.5s, width 0.5s, left 0.5s, height 0.5s;
                flex-shrink: 0;
            }

            .image-container[zoomed] {
                position: absolute;
                top: 0;
                left: 0;
                height: 100vh;
                width: 100vw;
            }

            iron-swipeable-pages {
                width: 100%
            }

            .dialog-control {
                opacity: 0;
                transition: opacity 0.5s;
            }

            mwc-icon-button[icon=clear] {
                position: fixed;
                top: 16px;
                left: 16px;
            }

            mwc-icon-button[icon=open_in_full] {
                position: absolute;
                top: 16px;
                right: 16px;
            }

            :host([expanded]) .dialog-control {
                opacity: 1;
            }

            .swipe-container {
                position: absolute;
                right: 16px;
                bottom: 64px;
            }
        `;
    }

    render() {
        return html`
            <div class=expando-container>
                <div class=content-container>
                    <div class=image-container>
                        <img src="assets/${this.src}" alt=${this.title}></img>
                        <div class=title-container>
                            <span class=title>${this.title}</title>
                        </div>
                        <mwc-icon-button class=dialog-control icon=open_in_full @click=${this.zoom}></mwc-icon-button>
                    </div>
                    <div class=info-container>
                        ${this.info}
                        ${this.description && html`
                            <h3>Description</h3>
                            <p>${this.description}</p>
                        `}
                        ${this.habitat && html`
                            <h3>Habitat</h3>
                            <p>${this.habitat}</p>
                        `}
                        ${this.tackle && html`
                            <h3>Tackle</h3>
                            <ul>
                                ${this.tackle.map(n=>html`<li>${n}</li>`)}
                            </ul>
                        `}
                        ${this.lures && html`
                            <h3>Lures</h3>
                            <ul>
                                ${this.lures.map(n=>html`<li>${n}</li>`)}
                            </ul>
                        `}
                        ${this.notes && html`
                            <h3>Notes</h3>
                            <ul>
                                ${this.notes.map(n=>html`<li>${n}</li>`)}
                            </ul>
                        `}
                    </div>
                    <div class=dialog-control-container>
                        <mwc-icon-button class=dialog-control icon=clear @click=${this.close}></mwc-icon-button>
                    </div>
                </div>
            </div>
        `;
    }
}