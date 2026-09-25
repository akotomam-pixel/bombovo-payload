const REQUIRED_SVP_INQUIRY_FIELDS = [
  'stredisko',
  'datumPrichodu',
  'veduciPobytu',
  'nazovSkoly',
  'adresa',
  'mesto',
  'telefon',
  'email',
  'vekZiakov',
  'pocetZiakov',
  'pocetPedagogov',
  'zdravotnik',
] as const

export function validateSvpInquiry(body: unknown): { valid: boolean; missingFields: string[] } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { valid: false, missingFields: [...REQUIRED_SVP_INQUIRY_FIELDS] }
  }

  const values = body as Record<string, unknown>
  const missingFields = REQUIRED_SVP_INQUIRY_FIELDS.filter((field) => {
    const value = values[field]
    return typeof value !== 'string' || value.trim() === ''
  })

  const email = typeof values.email === 'string' ? values.email.trim() : ''
  const phone = typeof values.telefon === 'string' ? values.telefon.replace(/\D/g, '') : ''
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) missingFields.push('email')
  if (phone && phone.length < 9) missingFields.push('telefon')

  return { valid: missingFields.length === 0, missingFields: [...new Set(missingFields)] }
}
