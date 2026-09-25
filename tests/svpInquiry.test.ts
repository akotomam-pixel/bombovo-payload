import assert from 'node:assert/strict'
import test from 'node:test'
import { validateSvpInquiry } from '../lib/svpInquiry'

const validInquiry = {
  stredisko: 'Hotel Osrblie',
  datumPrichodu: '10. 5. 2027',
  veduciPobytu: 'Test Teacher',
  nazovSkoly: 'Test School',
  adresa: 'Test 1',
  mesto: 'Bratislava',
  telefon: '+421 915 123 456',
  email: 'teacher@example.com',
  vekZiakov: '1. stupeň ZŠ',
  pocetZiakov: '30',
  pocetPedagogov: '3',
  zdravotnik: 'Vlastný zdravotník',
}

test('a complete ŠVP inquiry passes server validation', () => {
  assert.deepEqual(validateSvpInquiry(validInquiry), { valid: true, missingFields: [] })
})

test('an incomplete inquiry cannot reach email or conversion handling', () => {
  const result = validateSvpInquiry({
    stredisko: validInquiry.stredisko,
    telefon: validInquiry.telefon,
    email: validInquiry.email,
  })
  assert.equal(result.valid, false)
  assert.ok(result.missingFields.includes('datumPrichodu'))
  assert.ok(result.missingFields.includes('nazovSkoly'))
})

test('malformed email and phone values fail server validation', () => {
  const result = validateSvpInquiry({ ...validInquiry, email: 'not-an-email', telefon: '123' })
  assert.equal(result.valid, false)
  assert.ok(result.missingFields.includes('email'))
  assert.ok(result.missingFields.includes('telefon'))
})
