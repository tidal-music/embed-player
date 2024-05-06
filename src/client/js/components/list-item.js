export class ListItem extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keydown', e => {
      if (e.code === 'Space') {
        this.play();
      }
    });
  }

  connectedCallback() {
    const productId = this.getAttribute('product-id');
    const productType = this.getAttribute('product-type');

    this.sDOM = this.attachShadow({ mode: 'open' });
    const template = document.getElementById('wc-list-item');

    if (template instanceof HTMLTemplateElement) {
      this.sDOM.appendChild(template.content.cloneNode(true));
      const tidalPlayTrigger = this.sDOM.querySelector('tidal-play-trigger');

      if (tidalPlayTrigger && productId && productType) {
        tidalPlayTrigger.setAttribute('product-id', productId);
        tidalPlayTrigger.setAttribute('product-type', productType);
        tidalPlayTrigger.setAttribute('aria-label', `Play ${productType}`);
      }
    }

    const svgFOUC = document.getElementById('svg-fouc');

    if (svgFOUC) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          svgFOUC.remove();
        });
      });
    }
  }

  play() {
    const playTrigger = this.sDOM?.querySelector('tidal-play-trigger');

    if (playTrigger instanceof HTMLElement) {
      playTrigger.click();
    }
  }

  get mediaProductTitle() {
    return this.querySelector('[slot="title"]')?.textContent;
  }
}

const name = 'list-item';

if (!customElements.get(name)) {
  customElements.define(name, ListItem);
}

export default name;
