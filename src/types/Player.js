// @flow

import type { Hero } from './Hero'
import type { Id } from './Id'

export type Player = {
  id: Id,
  name: string,
  hero: Hero,
  createdAt: number,
  wannaBattle: boolean,
  battleId: Id
}
