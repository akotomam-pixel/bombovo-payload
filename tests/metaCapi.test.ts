import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import test from 'node:test'
import {
  hasMetaMarketingConsent,
  normalizeMetaEventId,
  normalizeMetaPhone,
  sendMetaCapiEvents,
} from '../lib/metaCapi'

test('CookieYes advertisement consent must be explicitly granted', () => {
  assert.equal(hasMetaMarketingConsent(undefined), false)
  assert.equal(hasMetaMarketingConsent('necessary:yes,advertisement:no'), false)
  assert.equal(hasMetaMarketingConsent('necessary:yes,advertisement:yes'), true)
  assert.equal(hasMetaMarketingConsent('necessary%3Ayes%2Cadvertisement%3Ayes'), true)
  assert.equal(hasMetaMarketingConsent('%E0%A4%A'), false)
})

test('Meta event IDs accept browser UUIDs and reject unsafe values', () => {
  assert.equal(
    normalizeMetaEventId('550e8400-e29b-41d4-a716-446655440000'),
    '550e8400-e29b-41d4-a716-446655440000',
  )
  assert.equal(normalizeMetaEventId(''), null)
  assert.equal(normalizeMetaEventId('contains spaces'), null)
  assert.equal(normalizeMetaEventId(123), null)
})

test('Slovak phone numbers are normalized to country-code format', () => {
  assert.equal(normalizeMetaPhone('0915 123 456'), '421915123456')
  assert.equal(normalizeMetaPhone('+421 915 123 456'), '421915123456')
  assert.equal(normalizeMetaPhone('00421 915 123 456'), '421915123456')
})

test('Lead and SvP_Inquiry share one event ID in the server payload', async (t) => {
  const originalFetch = global.fetch
  const originalPixelId = process.env.META_PIXEL_ID
  const originalToken = process.env.META_CAPI_ACCESS_TOKEN
  const originalTestCode = process.env.META_CAPI_TEST_EVENT_CODE
  t.after(() => {
    global.fetch = originalFetch
    if (originalPixelId === undefined) delete process.env.META_PIXEL_ID
    else process.env.META_PIXEL_ID = originalPixelId
    if (originalToken === undefined) delete process.env.META_CAPI_ACCESS_TOKEN
    else process.env.META_CAPI_ACCESS_TOKEN = originalToken
    if (originalTestCode === undefined) delete process.env.META_CAPI_TEST_EVENT_CODE
    else process.env.META_CAPI_TEST_EVENT_CODE = originalTestCode
  })

  process.env.META_PIXEL_ID = '123456789'
  process.env.META_CAPI_ACCESS_TOKEN = 'test-token-never-sent'
  process.env.META_CAPI_TEST_EVENT_CODE = 'TEST123'

  let requestUrl = ''
  let requestInit: RequestInit | undefined
  global.fetch = async (input, init) => {
    requestUrl = String(input)
    requestInit = init
    return new Response(JSON.stringify({ events_received: 2 }), { status: 200 })
  }

  const eventId = '550e8400-e29b-41d4-a716-446655440000'
  await sendMetaCapiEvents({
    eventNames: ['Lead', 'SvP_Inquiry'],
    eventId,
    eventSourceUrl: 'https://www.bombovo.sk/skoly-v-prirode/hotel-osrblie',
    userData: {
      email: ' Teacher@Example.com ',
      phone: '0915 123 456',
      clientIpAddress: '203.0.113.10',
      clientUserAgent: 'test-agent',
    },
  })

  assert.equal(requestUrl, 'https://graph.facebook.com/v21.0/123456789/events')
  assert.equal(requestUrl.includes('test-token-never-sent'), false)
  assert.equal(new Headers(requestInit?.headers).get('authorization'), 'Bearer test-token-never-sent')

  const payload = JSON.parse(String(requestInit?.body))
  assert.deepEqual(payload.data.map((event: { event_name: string }) => event.event_name), [
    'Lead',
    'SvP_Inquiry',
  ])
  assert.deepEqual(payload.data.map((event: { event_id: string }) => event.event_id), [eventId, eventId])
  assert.equal(payload.data[1].action_source, 'website')
  assert.equal(payload.data[1].event_source_url, 'https://www.bombovo.sk/skoly-v-prirode/hotel-osrblie')
  assert.equal(payload.test_event_code, 'TEST123')
  assert.equal(
    payload.data[1].user_data.em[0],
    createHash('sha256').update('teacher@example.com').digest('hex'),
  )
  assert.equal(
    payload.data[1].user_data.ph[0],
    createHash('sha256').update('421915123456').digest('hex'),
  )
})
