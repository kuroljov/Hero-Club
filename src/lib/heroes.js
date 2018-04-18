// @flow

import type { Hero } from '../types/Hero'

const Barb: Hero = {
  type: 'Barb',
  health: 6,
  defence: 1,
  damage: [4, 6]
}

const Sorc: Hero = {
  type: 'Sorc',
  health: 12,
  defence: 2,
  damage: [1, 3]
}

export default { Barb, Sorc }
