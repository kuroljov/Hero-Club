// @flow

import type { Hero } from '../lib/heroes'

type State = {
  name: string,
  hero: Hero,
  createdAt: number,
}

export default {
  strict: true,
  namespaced: true,
  state: {
    name: null,
    hero: null,
    createdAt: null
  },
  mutations: {
    setup (state: State, me: State) {
      state.name = me.name
      state.hero = me.hero
      state.createdAt = me.createdAt
    }
  }
}
