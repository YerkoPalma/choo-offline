const html = require('choo/html')
const offline = require('./')
const choo = require('choo')

const app = choo()

app.model({
  state: {
    count: 0
  },
  reducers: {
    increment: (action, state) => ({ count: state.count + 1 }),
    /**
     * If you turn off your internet connection, then the button of the example
     * app will decrement instead of increment the count,
     * keep in mind that the increment reducer get called too.
     */
    decrement: (action, state) => ({ count: state.count - 2 })
  }
})

app.router(route => [
  route('/', (state, prev, send) => html`
  <main>
    <h1>${state.count}</h1>
    <button onclick=${() => send('increment', { _backup: 'decrement' })}>+1</button>
  </main>
`)])

offline((offline) => {
  app.use(offline)
  const tree = app.start()
  document.body.appendChild(tree)
})
