// @flow

import { Player } from '../lib/api'
import type { Hero } from '../lib/heroes'

type State = {
  me: {
    id: string,
    name: string,
    hero: Hero,
    createdAt: number,
  }
}

export default {
  strict: true,
  namespaced: true,
  state: {
    me: {}
  },
  getters: {
    id: (state: State) => state.me.id,
    name: (state: State) => state.me.name,
    hero: (state: State) => state.me.hero,
    isLoggedIn: (state: State) => !!state.me.name && !!state.me.hero
  },
  mutations: {
    addInfo (state: State, info: Object) {
      state.me = { ...state.me, ...info }
    }
  },
  actions: {
    addInfo ({ commit }: Object, info: Object) {
      commit('addInfo', info)
    },
    async createPlayer ({ commit, state }: Object, { name, hero }: Object) {
      const id = state.me.id

      const me = await Player.create({ id, name, hero })

      commit('addInfo', me)
    }
  }
}
