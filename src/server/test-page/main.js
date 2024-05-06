window.onmessage = event => {
  console.debug('Received message:');
  // eslint-disable-next-line no-console
  console.log(event);
};

const triggerPlayButton = document.querySelector('#trigger-play-button');
const triggerPauseButton = document.querySelector('#trigger-pause-button');
const playbackVictim = document.querySelector(
  '[data-trigger-playback-victim] iframe',
);

triggerPlayButton?.addEventListener('click', () => {
  if (playbackVictim instanceof HTMLIFrameElement) {
    playbackVictim.contentWindow?.postMessage(
      JSON.stringify({
        commandName: 'play',
      }),
      '*',
    );
  }
});

triggerPauseButton?.addEventListener('click', () => {
  if (playbackVictim instanceof HTMLIFrameElement) {
    playbackVictim.contentWindow?.postMessage(
      JSON.stringify({
        commandName: 'pause',
      }),
      '*',
    );
  }
});

const queriedExample =
  document.location.hash && document.querySelector(document.location.hash);

if (
  document.location.hash !== '' &&
  queriedExample instanceof HTMLDetailsElement
) {
  queriedExample?.setAttribute('open', 'open');
  queriedExample?.scrollIntoView();
}
