import { events as playerSdkEvents } from '@tidal-music/player-web-components';

import DialogController from '../dialog-controller.js';

import { ListItem } from './list-item.js';

export class MediaItemList extends HTMLElement {
  constructor() {
    super();

    playerSdkEvents.addEventListener(
      'media-product-transition',
      e => {
        if (e instanceof CustomEvent) {
          /** @type {import('@tidal-music/player').MediaProductTransition} */
          const event = e;
          const { productId } = event.detail.mediaProduct;

          const listItem = this.querySelector(`[product-id="${productId}"]`);

          if (listItem) {
            for (const currentElements of this.querySelectorAll('.current')) {
              currentElements.classList.remove('current');
            }

            listItem.classList.add('current');
          }
        }
      },
      { passive: true },
    );

    playerSdkEvents.addEventListener(
      'playback-state-change',
      e => {
        if (e instanceof CustomEvent) {
          /** @type {import('@tidal-music/player').PlaybackStateChange} */
          const event = e;
          const { state } = event.detail;

          this.currentItem?.setAttribute('data-playback-state', state);
        }
      },
      { passive: true },
    );

    playerSdkEvents.addEventListener(
      'ended',
      e => {
        const { currentItem, nextItem } = this;

        if (nextItem) {
          if (currentItem) {
            currentItem.removeAttribute('data-playback-state');
          }

          // Do not autoplay next song on end if user skips manually
          if (e instanceof CustomEvent && e.detail.reason !== 'skip') {
            nextItem.play();
          }
        } else {
          DialogController.show('finished');
        }
      },
      { passive: true },
    );

    function playClickedListItem(e) {
      const listItem = /** @type {ListItem | null} */ (
        e.composedPath().find(eventTarget => eventTarget instanceof ListItem)
      );

      if (listItem) {
        listItem.play();
      }
    }

    this.addEventListener('dblclick', e => playClickedListItem(e), {
      passive: true,
    });

    this.addEventListener(
      'pointerup',
      e => {
        const clickedPlaybackToggleButton = e.target instanceof SVGElement;

        if (e.pointerType !== 'touch' || clickedPlaybackToggleButton) {
          return;
        }

        playClickedListItem(e);
      },
      { passive: true },
    );
  }

  connectedCallback() {
    this.sDOM = this.attachShadow({ mode: 'open' });
    const template = document.getElementById('wc-media-item-list');

    if (template instanceof HTMLTemplateElement) {
      this.sDOM.appendChild(template.content.cloneNode(true));
    }
  }

  get allMediaItemsNotStreamReady() {
    const mediaItems = [...this.querySelectorAll('list-item')];
    const notStreamReadyMediaItems = [
      ...this.querySelectorAll('list-item[disabled]'),
    ];

    return mediaItems.length === notStreamReadyMediaItems.length;
  }

  /** @type {ListItem | null} */
  get currentItem() {
    return this.querySelector('.current');
  }

  /** @type {ListItem | null} */
  get firstPlayableItem() {
    return this.querySelector('list-item:not([disabled])');
  }

  /** @type {ListItem | null} */
  get nextItem() {
    return this.querySelector('.current ~ list-item:not([disabled])');
  }

  /** @type {ListItem | null} */
  get previousItem() {
    const currentlyPlayingLine = this.querySelector('list-item.current');
    const mediaListLines = [...this.querySelectorAll('list-item')];
    const indexOfCurrentlyPlayingLine = currentlyPlayingLine
      ? mediaListLines.indexOf(currentlyPlayingLine)
      : -1;
    const previousLine = /** @type {ListItem | undefined} */ (
      mediaListLines.slice(0, indexOfCurrentlyPlayingLine).pop()
    );

    return previousLine || null;
  }
}

const name = 'media-item-list';

if (!customElements.get(name)) {
  customElements.define(name, MediaItemList);
}

export default name;
