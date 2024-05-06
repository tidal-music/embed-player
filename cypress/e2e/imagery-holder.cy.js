import {
  bootIntoVideo,
  bootIntoClassicTrack,
  bootIntoClassicAlbum,
  bootIntoClassicPlaylist,
  bootIntoGridTrack,
  bootIntoGridAlbum,
  bootIntoGridPlaylist,
  clickPlayPauseButton,
  assertState
} from './helpers.js';

describe('Imagery holder', () => {
  describe('video', () => {
    it('starts playback when clicking cover', () => {
      bootIntoVideo();

      clickPlayPauseButton();
      assertState('playing');
    });

    it('pauses playback when clicking second time (on video)', () => {
      bootIntoVideo();

      clickPlayPauseButton();
      assertState('playing');

      clickPlayPauseButton();
      assertState('paused');
    });
  });

  describe('classic track', () => {
    it('starts playback when clicking cover', () => {
      bootIntoClassicTrack();

      clickPlayPauseButton();
      assertState('playing');
    });

    it('pauses playback when clicking second time', () => {
      bootIntoClassicTrack();

      clickPlayPauseButton();
      assertState('playing');

      clickPlayPauseButton();
      assertState('paused');
    });
  });

  describe('classic album', () => {
    it('starts playback when clicking cover', () => {
      bootIntoClassicAlbum();

      clickPlayPauseButton();
      assertState('playing');
    });

    it('pauses playback when clicking second time', () => {
      bootIntoClassicAlbum();

      clickPlayPauseButton();
      assertState('playing');

      clickPlayPauseButton();
      assertState('paused');
    });
  });

  describe('classic playlist', () => {
    it('starts playback when clicking cover', () => {
      bootIntoClassicPlaylist();

      clickPlayPauseButton();
      assertState('playing');
    });

    it('pauses playback when clicking second time', () => {
      bootIntoClassicPlaylist();

      clickPlayPauseButton();
      assertState('playing');

      clickPlayPauseButton();
      assertState('paused');
    });
  });

  describe('grid track', () => {
    it('starts playback when clicking cover', () => {
      bootIntoGridTrack();
      clickPlayPauseButton();
      assertState('playing');
    });

    it('pauses playback when clicking second time', () => {
      bootIntoGridTrack();

      clickPlayPauseButton();
      assertState('playing');

      clickPlayPauseButton();
      assertState('paused');
    });
  });

  describe('grid album', () => {
    it('starts playback when clicking cover', () => {
      bootIntoGridAlbum();

      clickPlayPauseButton();
      assertState('playing');
    });

    it('pauses playback when clicking second time', () => {
      bootIntoGridAlbum();

      clickPlayPauseButton();
      assertState('playing');

      clickPlayPauseButton();
      assertState('paused');
    });
  });

  describe('grid playlist', () => {
    it('starts playback when clicking cover', () => {
      bootIntoGridPlaylist();
      clickPlayPauseButton();
    });

    it('pauses playback when clicking second time', () => {
      bootIntoGridPlaylist();

      clickPlayPauseButton();
      assertState('playing');

      clickPlayPauseButton();
      assertState('paused');
    });
  });
});
