/* global navigator */
const xtend = require('xtend')
const isOnline = require('is-online')
var localforage = {}
const assert = require('assert')

function offline (opts, cb) {
  if (!cb) {
    cb = opts
    opts = {}
  }

  assert.equal(typeof opts, 'object', '[choo-offline] opts should be an object')
  assert.equal(typeof cb, 'function', '[choo-offline] cb should be a function')

  if ('serviceWorker' in navigator && opts.serviceWorker) {
    assert.equal(typeof opts.serviceWorker, 'string', '[choo-offline] opts.serviceWorker should be a string')

    if (opts.serviceWorker !== '') {
      navigator.serviceWorker.register(opts.serviceWorker).then(function (reg) {
        reg.onupdatefound = function () {
          var installingWorker = reg.installing

          installingWorker.onstatechange = function () {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  console.log('New or updated content is available.')
                } else {
                  console.log('Content is now available offline!')
                }
                break

              case 'redundant':
                console.error('The installing service worker became redundant.')
                break
            }
          }
        }
      }).catch(function (e) {
        console.error('Error during service worker registration:', e)
      })
    }
  }

  if (!window.indexedDB) {
    return cb({})
  } else {
    localforage = require('localforage')
  }
  if (opts.dbConfig) {
    assert.equal(typeof opts.dbConfig, 'object', '[choo-offline] opts.dbConfig should be an object')
    localforage.config(opts.dbConfig)
  }

  const onStateChange = (data, state, prev, createSend) => {
    localforage.setItem('app', state).then(value => {
      // Do other things once the value has been saved.
    }).catch(err => {
      // This code runs if there were any errors
      console.log(err)
    })
  }
  const onAction = (data, state, name, caller, createSend) => {
    isOnline(function (online) {
      // if we are offline and also have a backup function, dispatch that backup function
      if (!online && data._backup) {
        const backupEffect = data._backup
        delete data._backup
        const send = createSend(backupEffect, true)
        send(backupEffect, data, false)
      }
    })
  }
  localforage.getItem('app').then(localState => {
    cb({
      onStateChange,
      onAction,
      wrapInitialState: function (appState) {
        // if there is nothing in the database, but initial local state is defined
        // set initial data for indexedDB as initial app state
        // this will be hit only once, because in future calls
        // localState will be defined
        if (!localState && appState) {
          localforage.setItem('app', appState)
        }
        return xtend(appState, localState)
      }
    })
  }).catch(err => {
    throw err
  })
}

module.exports = offline
