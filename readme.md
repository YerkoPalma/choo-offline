# choo-offline [![Build Status](https://secure.travis-ci.org/YerkoPalma/choo-offline.svg?branch=master)](https://travis-ci.org/YerkoPalma/choo-offline) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

> offline first support for choo apps

## Installation

```bash
npm install --save choo-offline
```

## Usage

```javascript
const choo = require('choo')
const offline = require('choo-offline')

const app = choo()

offline(offline => {
  app.use(offline)

  const tree = app.start()
  document.body.appendChild(tree)
})
```

## API

### `offline([opts], fn())`

Function that wraps the choo `start` and `use` methods, only needed for this plugin, other plugins can be registered before.
It can take two parameters.

#### `opts`

Type: `Object`

Optional configuration object for the plugin, can take the following options:

- `serviceWorker` (String): A string with the relative path to a service worker file, if not provided, it will not install a service worker. Defaults: `''`.
- `dbConfig` (Object): An object with [localforage config](https://github.com/localForage/localForage#configuration).

#### `fn`

Type: `Function`

Required function that get as the only argument, the offline plugin object. The object use the following hooks:

- `onStateChange`: To update the app state locally with localforage.
- `onAction`: To check if the app is offline and, if it is, use a backup action. Use the backup function when you have actions that depend on network availability,
   just define a `_backup` option in your `send()` data, the `_backup` option must be a string calling an effect or reducer from your model. For example
   
   ```javascript
      send('xhrEffect', { foo: bar, _backup: 'nonXhrBackup' })
   ```
   
   The above statement will call `xhrEffect` normally, but, assuming that is a xhr call, when offline, it will call the `nonXhrBackup` effect|reducer, passing the same data, excluding the _backup strings, i.e. the `foo` option. 
- `wrapInitialState`: To get the initial local state.

## License

MIT

Crafted with <3 by [YerkoPalma](https://github.com/YerkoPalma) .

***

> This package was initially generated with [yeoman](http://yeoman.io) and the [p generator](https://github.com/johnotander/generator-p.git).
