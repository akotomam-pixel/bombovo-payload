import { CampDetailData } from './types'
import { artlantidaData } from './artlantida'
import { babinecData } from './babinec'
import { chlapinecData } from './chlapinec'
import { festAnimatorFestData } from './fest-animator-fest'
import { readyPlayerOneData } from './ready-player-one'
import { tanecnaPlanetaData } from './tanecna-planeta'
import { olympKempData } from './olymp-kemp'
import { woodkempData } from './woodkemp'
import { expectoData } from './expecto'
import { neverfortData } from './neverfort'
import { stastnaPlutvaData } from './stastna-plutva'
import { zBoduNulaDoBoduStoData } from './z-bodu-nula-do-bodu-sto'
import { kazdyDenNovyZazitokData } from './kazdy-den-novy-zazitok'
import { vDracejNoreData } from './v-dracej-nore'
import { tajomstvoBasketbalovehoPoharaData } from './tajomstvo-basketbaloveho-pohara'
import { anglickeLetoData } from './anglicke-leto'
import { trhlinaData } from './trhlina'

export const campDetailsMap: Record<string, CampDetailData> = {
  'artlantida': artlantidaData,
  'babinec': babinecData,
  'chlapinec': chlapinecData,
  'fest-animator-fest': festAnimatorFestData,
  'ready-player-one': readyPlayerOneData,
  'tanecna-planeta': tanecnaPlanetaData,
  'olymp-kemp': olympKempData,
  'woodkemp': woodkempData,
  'expecto': expectoData,
  'neverfort': neverfortData,
  'stastna-plutva': stastnaPlutvaData,
  'z-bodu-nula-do-bodu-sto': zBoduNulaDoBoduStoData,
  'kazdy-den-novy-zazitok': kazdyDenNovyZazitokData,
  'v-dracej-nore': vDracejNoreData,
  'tajomstvo-basketbaloveho-pohara': tajomstvoBasketbalovehoPoharaData,
  'anglicke-leto': anglickeLetoData,
  'trhlina': trhlinaData,
}

export function getCampDetails(campId: string): CampDetailData | null {
  return campDetailsMap[campId] || null
}
