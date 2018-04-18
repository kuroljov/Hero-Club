// @flow

import type { Hero } from './Hero'

export type Player = {
  id: string,
  name: string,
  hero: Hero,
  createdAt: number,
  wannaBattle: boolean
}
