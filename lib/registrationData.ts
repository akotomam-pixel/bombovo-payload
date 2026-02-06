import { getCampDetails } from '@/data/camps'
import { camps as allCamps } from './campsData'

export interface RegistrationData {
  registrationId: number
  campId: string
  campName: string
  location: string
  dateStart: string
  dateEnd: string
  days: number
  originalPrice: string
  discountedPrice: string
}

/**
 * Get all available registrations
 */
export function getAllRegistrations(): RegistrationData[] {
  const registrations: RegistrationData[] = []

  for (const camp of allCamps) {
    const details = getCampDetails(camp.id)
    if (details) {
      for (const date of details.section5.dates) {
        if (date.registrationId) {
          registrations.push({
            registrationId: date.registrationId,
            campId: camp.id,
            campName: details.name,
            location: details.location,
            dateStart: date.start,
            dateEnd: date.end,
            days: date.days,
            originalPrice: date.originalPrice,
            discountedPrice: date.discountedPrice,
          })
        }
      }
    }
  }

  return registrations
}

/**
 * Get registration by ID
 */
export function getRegistrationById(id: number): RegistrationData | null {
  const registrations = getAllRegistrations()
  return registrations.find(r => r.registrationId === id) || null
}
