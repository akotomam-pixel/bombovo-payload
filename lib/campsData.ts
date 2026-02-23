
import { olympKempData } from '@/data/camps/olymp-kemp'
import { festAnimatorFestData } from '@/data/camps/fest-animator-fest'
import { tanecnaPlanetaData } from '@/data/camps/tanecna-planeta'
import { babinecData } from '@/data/camps/babinec'
import { tajomstvoBasketbalovehoPoharaData } from '@/data/camps/tajomstvo-basketbaloveho-pohara'
import { trhlinaData } from '@/data/camps/trhlina'
import { readyPlayerOneData } from '@/data/camps/ready-player-one'
import { vDracejNoreData } from '@/data/camps/v-dracej-nore'
import { anglickeLetoData } from '@/data/camps/anglicke-leto'
import { neverfortData } from '@/data/camps/neverfort'
import { chlapinecData } from '@/data/camps/chlapinec'
import { artlantidaData } from '@/data/camps/artlantida'
import { stastnaPlutvaData } from '@/data/camps/stastna-plutva'
import { kazdyDenNovyZazitokData } from '@/data/camps/kazdy-den-novy-zazitok'
import { zBoduNulaDoBoduStoData } from '@/data/camps/z-bodu-nula-do-bodu-sto'
import { woodkempData } from '@/data/camps/woodkemp'
import { expectoData } from '@/data/camps/expecto'

// Handles both hyphen and em-dash: "8-14 rokov" or "10 – 16 rokov"
function parseAge(ageStr: string): { short: string; range: [number, number] } {
  const match = ageStr.match(/(\d+)\s*[-–]\s*(\d+)/)
  if (match) {
    return {
      short: `${match[1]}-${match[2]} r.`,
      range: [parseInt(match[1]), parseInt(match[2])],
    }
  }
  return { short: ageStr, range: [0, 99] }
}

export interface Camp {
  id: string
  name: string
  age: string
  ageRange: [number, number]
  types: string[]
  displayTypes: string[]
  price: string
  dates: string[]
  description: string
  image: string
}

export const camps: Camp[] = [
  {
    id: 'olymp-kemp',
    name: 'Olymp Kemp',
    ...parseAgeFields(olympKempData.age),
    types: ['Náučný', 'Dobrodružný'],
    displayTypes: ['Náučný', 'Dobrodružný'],
    price: olympKempData.price,
    dates: ['1-jul', '2-jul', '1-aug', '2-aug'],
    description: olympKempData.bulletPoints[0],
    image: '/images/Letne%20Tabory/olympcamp.JPG',
  },
  {
    id: 'fest-animator-fest',
    name: 'Fest Animator Fest',
    ...parseAgeFields(festAnimatorFestData.age),
    types: ['Tínedžerský', 'Akčný'],
    displayTypes: ['Tínedžerský', 'Akčný'],
    price: festAnimatorFestData.price,
    dates: ['1-jul', '2-jul', '1-aug', '2-aug'],
    description: festAnimatorFestData.bulletPoints[0],
    image: '/images/Letne%20Tabory/fest.JPG',
  },
  {
    id: 'tanecna-planeta',
    name: 'Tanečná Planéta',
    ...parseAgeFields(tanecnaPlanetaData.age),
    types: ['Tanečný', 'Umelecký'],
    displayTypes: ['Športový', 'Umelecký'],
    price: tanecnaPlanetaData.price,
    dates: ['1-jul', '1-aug'],
    description: tanecnaPlanetaData.bulletPoints[0],
    image: '/images/Letne%20Tabory/tanecnaplaneta.JPG',
  },
  {
    id: 'babinec',
    name: 'Babinec',
    ...parseAgeFields(babinecData.age),
    types: ['Unikátny', 'Oddychový', 'Umelecký'],
    displayTypes: ['Unikátny', 'Oddychový'],
    price: babinecData.price,
    dates: ['1-jul', '2-jul'],
    description: babinecData.bulletPoints[0],
    image: '/images/Letne%20Tabory/babinec.JPG',
  },
  {
    id: 'tajomstvo-basketbaloveho-pohara',
    name: 'Tajomstvo Basketbalového Pohára',
    ...parseAgeFields(tajomstvoBasketbalovehoPoharaData.age),
    types: ['Basketbal', 'Akčný'],
    displayTypes: ['Športový', 'Akčný'],
    price: tajomstvoBasketbalovehoPoharaData.price,
    dates: ['1-aug'],
    description: tajomstvoBasketbalovehoPoharaData.bulletPoints[0],
    image: '/images/Letne%20Tabory/tajomstvopohara.JPG',
  },
  {
    id: 'trhlina',
    name: 'Trhlina',
    ...parseAgeFields(trhlinaData.age),
    types: ['Akčný', 'Dobrodružný'],
    displayTypes: ['Akčný', 'Dobrodružný'],
    price: trhlinaData.price,
    dates: ['1-aug'],
    description: trhlinaData.bulletPoints[0],
    image: '/images/Letne%20Tabory/trhlina.JPG',
  },
  {
    id: 'ready-player-one',
    name: 'Ready Player One',
    ...parseAgeFields(readyPlayerOneData.age),
    types: ['Akčný', 'Unikátny', 'Športový'],
    displayTypes: ['Akčný', 'Unikátny'],
    price: readyPlayerOneData.price,
    dates: ['2-jul', '2-aug'],
    description: readyPlayerOneData.bulletPoints[0],
    image: '/images/Letne%20Tabory/readypleayer.JPG',
  },
  {
    id: 'v-dracej-nore',
    name: 'V Dracej Nore',
    ...parseAgeFields(vDracejNoreData.age),
    types: ['Fantasy', 'Dobrodružný'],
    displayTypes: ['Fantasy', 'Dobrodružný'],
    price: vDracejNoreData.price,
    dates: ['1-aug'],
    description: vDracejNoreData.bulletPoints[0],
    image: '/images/Letne%20Tabory/V-dracej-nore.JPG',
  },
  {
    id: 'anglicke-leto',
    name: 'Summer Advanture',
    ...parseAgeFields(anglickeLetoData.age),
    types: ['Oddychový', 'Náučný'],
    displayTypes: ['Oddychový', 'Náučný'],
    price: anglickeLetoData.price,
    dates: ['1-jul'],
    description: anglickeLetoData.bulletPoints[0],
    image: '/images/Letne%20Tabory/summeradvatnure.JPG',
  },
  {
    id: 'neverfort',
    name: 'Neverfort',
    ...parseAgeFields(neverfortData.age),
    types: ['Akčný', 'Fantasy'],
    displayTypes: ['Akčný', 'Fantasy'],
    price: neverfortData.price,
    dates: ['1-aug'],
    description: neverfortData.bulletPoints[0],
    image: '/images/Letne%20Tabory/neverfot.JPG',
  },
  {
    id: 'chlapinec',
    name: 'Chlapinec',
    ...parseAgeFields(chlapinecData.age),
    types: ['Akčný', 'Náučný'],
    displayTypes: ['Akčný', 'Náučný'],
    price: chlapinecData.price,
    dates: ['1-jul', '2-jul'],
    description: chlapinecData.bulletPoints[0],
    image: '/images/Letne%20Tabory/chlapinec.JPG',
  },
  {
    id: 'artlantida',
    name: 'Artlantída',
    ...parseAgeFields(artlantidaData.age),
    types: ['Umelecký', 'Oddychový'],
    displayTypes: ['Umelecký', 'Oddychový'],
    price: artlantidaData.price,
    dates: ['1-jul', '2-jul'],
    description: artlantidaData.bulletPoints[0],
    image: '/images/Letne%20Tabory/Art.JPG',
  },
  {
    id: 'stastna-plutva',
    name: 'Šťastná Plutva',
    ...parseAgeFields(stastnaPlutvaData.age),
    types: ['Oddychový'],
    displayTypes: ['Oddychový'],
    price: stastnaPlutvaData.price,
    dates: ['1-aug'],
    description: stastnaPlutvaData.bulletPoints[0],
    image: '/images/Letne%20Tabory/plutva.JPG',
  },
  {
    id: 'kazdy-den-novy-zazitok',
    name: 'Každý Deň Nový Zážitok',
    ...parseAgeFields(kazdyDenNovyZazitokData.age),
    types: ['Dobrodružný', 'Umelecký'],
    displayTypes: ['Dobrodružný', 'Umelecký'],
    price: kazdyDenNovyZazitokData.price,
    dates: ['2-jul', '1-aug'],
    description: kazdyDenNovyZazitokData.bulletPoints[0],
    image: '/images/Letne%20Tabory/kazdydennovyzazitok.JPG',
  },
  {
    id: 'z-bodu-nula-do-bodu-sto',
    name: 'Z Bombova Do Bombova',
    ...parseAgeFields(zBoduNulaDoBoduStoData.age),
    types: ['Oddychový', 'Unikátny'],
    displayTypes: ['Oddychový', 'Unikátny'],
    price: zBoduNulaDoBoduStoData.price,
    dates: ['1-jul', '1-aug'],
    description: zBoduNulaDoBoduStoData.bulletPoints[0],
    image: '/images/Letne%20Tabory/zbombova-do-bombova.JPG',
  },
  {
    id: 'woodkemp',
    name: 'WoodKemp',
    ...parseAgeFields(woodkempData.age),
    types: ['Akčný', 'Náučný'],
    displayTypes: ['Akčný', 'Náučný'],
    price: woodkempData.price,
    dates: ['2-jul', '1-aug'],
    description: woodkempData.bulletPoints[0],
    image: '/images/Letne%20Tabory/woodcamp.JPG',
  },
  {
    id: 'expecto',
    name: 'Expecto Patronum!',
    ...parseAgeFields(expectoData.age),
    types: ['Dobrodružný', 'Fantasy'],
    displayTypes: ['Dobrodružný', 'Fantasy'],
    price: expectoData.price,
    dates: ['1-jul'],
    description: expectoData.bulletPoints[0],
    image: '/images/Letne%20Tabory/expcto.JPG',
  },
]

// Helper used inline above — must be defined before the array
function parseAgeFields(ageStr: string): { age: string; ageRange: [number, number] } {
  const parsed = parseAge(ageStr)
  return { age: parsed.short, ageRange: parsed.range }
}
