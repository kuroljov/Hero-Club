// @flow

import type { Hero } from '../types/Hero'

function calcDamage (hero: Hero): number {
  return hero.damage[0]
}

export default calcDamage
