import assert from 'node:assert/strict'
import test from 'node:test'
import { orderNewest, orderRecommended, type OrderableReview } from '../lib/reviewOrder'

let nextId = 1
function review(over: Partial<OrderableReview> = {}): OrderableReview {
  return {
    id: nextId++,
    reviewer_type: 'tabornik',
    camp_name: 'Fest animátor fest',
    stars: 5,
    review_text: 'Bol to super tábor a o rok idem znova.',
    date: '2026-08-19',
    ...over,
  }
}

const long = (n: number) => 'Veľmi dobrý tábor. '.repeat(Math.ceil(n / 19)).slice(0, n)

test('reviews without text get no card', () => {
  const list = [review(), review({ review_text: null }), review({ review_text: '  ' })]
  assert.equal(orderRecommended(list).length, 1)
  assert.equal(orderNewest(list).length, 1)
})

test('parents and kids take turns, a parent first', () => {
  const list = [
    ...Array.from({ length: 6 }, () => review({ reviewer_type: 'tabornik', review_text: long(300) })),
    ...Array.from({ length: 6 }, () => review({ reviewer_type: 'rodic', review_text: long(300), camp_name: 'Babinec' })),
  ]
  const types = orderRecommended(list, { camp: 'x' }).map((r) => r.reviewer_type)
  assert.deepEqual(types.slice(0, 6), ['rodic', 'tabornik', 'rodic', 'tabornik', 'rodic', 'tabornik'])
})

test('no two reviews from the same camp in a row near the top', () => {
  const camps = ['Fest animátor fest', 'Fest animátor fest', 'Fest animátor fest', 'Babinec', 'WoodKemp']
  const list = Array.from({ length: 40 }, (_, i) =>
    review({ camp_name: camps[i % camps.length], reviewer_type: i % 2 ? 'rodic' : 'tabornik', review_text: long(100 + i * 10) })
  )
  const ordered = orderRecommended(list)
  for (let i = 1; i < 12; i++) assert.notEqual(ordered[i].camp_name, ordered[i - 1].camp_name)
})

test('low-star and flagged reviews sit in the middle, never at the top', () => {
  const list = [
    ...Array.from({ length: 40 }, () => review({ review_text: long(120) })),
    review({ stars: 1, review_text: long(650) }),
    review({ stars: 4, review_text: long(650) }),
    review({ mid_list: true, review_text: long(650) }),
  ]
  const ordered = orderRecommended(list)
  assert.equal(ordered.length, 43)
  ordered.forEach((r, i) => {
    if (r.stars < 5 || r.mid_list) assert.ok(i >= 15 && i <= 28, `mid-list review at position ${i}`)
  })
})

test('a two-camp review sits mid-list only under its second camp', () => {
  const twoCamp = review({ camp_name: 'Trhlina', second_camp_name: 'Babinec', review_text: long(690) })
  const babinec = Array.from({ length: 20 }, () => review({ camp_name: 'Babinec', review_text: long(100) }))
  assert.ok(orderRecommended([twoCamp, ...babinec], { camp: 'Babinec' }).indexOf(twoCamp) >= 8)
  assert.equal(orderRecommended([twoCamp, review({ camp_name: 'Trhlina' })], { camp: 'Trhlina' })[0], twoCamp)
})

test('the order is the same on every call', () => {
  const list = Array.from({ length: 30 }, (_, i) => review({ reviewer_type: i % 3 ? 'tabornik' : 'rodic', review_text: long(50 + (i * 37) % 500) }))
  const a = orderRecommended(list).map((r) => r.id)
  const b = orderRecommended(list.slice().reverse()).map((r) => r.id)
  assert.deepEqual(a, b)
})

test('newest first, undated reviews last', () => {
  const a = review({ date: '2026-07-01' })
  const b = review({ date: '2026-09-01' })
  const c = review({ date: null })
  assert.deepEqual(orderNewest([a, c, b]), [b, a, c])
})
