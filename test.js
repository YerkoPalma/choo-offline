import test from 'ava'
import offline from './'

test('choo-offline assertions', t => {
  t.plan(1)

  t.throws(() => { offline() })
})
