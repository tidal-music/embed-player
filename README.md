# TIDAL Embed Player

[![Linting CSS](https://github.com/tidal-music/embed-player/actions/workflows/lint-css.yml/badge.svg?branch=main)](https://github.com/tidal-music/embed-player/actions/workflows/lint-css.yml) [![Linting JS](https://github.com/tidal-music/embed-player/actions/workflows/lint-js.yml/badge.svg?branch=main)](https://github.com/tidal-music/embed-player/actions/workflows/lint-js.yml) [![Web Test Runner](https://github.com/tidal-music/embed-player/actions/workflows/web-test-runner.yml/badge.svg?branch=main)](https://github.com/tidal-music/embed-player/actions/workflows/web-test-runner.yml) [![Cypress](https://github.com/tidal-music/embed-player/actions/workflows/cypress.yml/badge.svg?branch=main)](https://github.com/tidal-music/embed-player/actions/workflows/cypress.yml)

This repository contains the front-end and back-end source code for the TIDAL Embed Player. The back-end consists of an AWS Lambda function that server-side renders parts of the application. The front-end consists of logic for event handlers and playback logic (via [tidal-sdk-web](https://github.com/tidal-music/tidal-sdk-web)).

## Building

Build the project by issuing the `pnpm build` command. Mind the environment variables below.

The build commands outputs to the dist folder where the front-end parts are outputted to the dist/client folder and the AWS Lambda code to the dist/server folder. Adjust the `getStaticFileLink()` method to where you deploy your front-end resources.

### Environment Variables

| Variable Name | Description |
| ------------- | ----------- |
| EMBED_API_TOKEN | Required - Your TIDAL API token |
| TRACK_JS_TOKEN | Not required - Specify along with TRACK_JS_APPLICATION to include TrackJS |
| TRACK_JS_APPLICATION | Not required - Specify along with TRACK_JS_TOKEN to include TrackJS |
