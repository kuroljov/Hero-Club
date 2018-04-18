// @flow

import api from '../lib/api'

import type { Player } from '../types/Player'
import type { Battle } from '../types/Battle'

type State = {
  battle: Battle,
  opponent: Player
}

type BattleCreate = {
  opponent: Player
}

export default {
  strict: true,
  namespaced: true,
  state: {
    battle: {},
    opponent: {}
  },
  getters: {
    battle: (state: State) => state.battle,
    opponent: (state: State) => state.opponent
  },
  mutations: {
    setBattle (state: State, battle: Object) {
      state.battle = battle
    },
    setOpponent (state: State, opponent: Player) {
      state.opponent = opponent
    }
  },
  actions: {
    createBattle ({ commit, rootGetters }: Object, battle: BattleCreate) {
      const meId = rootGetters['me/me'].id
      const opponentId = battle.opponent.id

      return api.battle.createOne({
        players: [meId, opponentId]
      })
        .then((battleInfo) => {
          commit('setBattle', battleInfo)
          commit('setOpponent', battle.opponent)

          return battleInfo
        })
    }
  }
}
