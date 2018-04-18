// @flow

import api from '../lib/api'
import type { Player } from '../types/Player'

type State = {
  me: Player,
}

export default {
  strict: true,
  namespaced: true,
  state: {
    me: {}
  },
  getters: {
    me: (state: State) => state.me,
    isLoggedIn: (state: State) => !!state.me.name && !!state.me.hero
  },
  mutations: {
    addInfo (state: State, info: Object) {
      state.me = { ...state.me, ...info }
    },
    meWannaBattle (state: State, either: boolean) {
      state.me.wannaBattle = either
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
    },
    meWannaBattle ({ getters, commit }: Object, either: boolean) {
      return api.players.wannaBattle(getters.me.id, true)
        .then(() => {
          commit('meWannaBattle', either)
        })
    }
  }
}
