// @flow

import api from '../lib/api'
import type { Player } from '../types/Player'

type State = {
  me: Player
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
    isBusy: (state: State) => state.me.isBusy,
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

      const me = await api.players.createOne({ id, name, hero })

      commit('addInfo', me)
    }
  }
}
