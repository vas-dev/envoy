# Envoy

Launches a proxy that saves API responses for frontend development. Can also return saved responses.

## Install

_Note:_ Make sure you have a GitHub token set up with package registry access

Add `.npmrc` to your root with:

```
@vas-dev:registry=https://npm.pkg.github.com
```

With `yarn`:

```sh
yarn add --dev @vas-dev/envoy
```

With `npm`:

```sh
npm install --save-dev @vas-dev/envoy
```

## Usage

1. Add config options to `package.json`
   ```json
   "envoy": {
     "port": 3001,
     "target": "https://localhost:3000",
     "routesPath": "./routes.js",
     "fileType": "es6",
     "saveResponse": true,
     "responsePath": "./mocks"
   },
   ```
1. Run the server
   ```sh
   yarn run envoy
   ```

Point your app URL to `http://localhost:3001`

## Configuration options

### `port` (_default: 3001_)

The port which the server will run on

### `target` (_required_)

The url which will be proxied

### `routesPath` (_required_)

Local path to a routes file

### `fileType` (_default: es6_)

Save responses in either `es6` format or `node`

### `saveResponse` (_default: false_)

Toggle saving responses to disk

### `responsePath` (_required if `saveResponse` is true_)

Path to save responses
