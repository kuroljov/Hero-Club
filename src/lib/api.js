// @flow

import { db } from './firebase'
import obj2arr from './obj2arr'
import UId from './Id'

import type { Hero } from '../types/Hero'
import type { Id } from '../types/Id'

type PlayerCreate = {
  id: Id,
  name: string,
  hero: Hero,
}

type BattleCreate = {
  players: [Id, Id]
}

export default {
  battle: {
    findOneById: (id: string) => new Promise((resolve, reject) => {
      const ref = `battles/${id}`

      return db
        .ref(ref)
        .once('value', (snapshot) => {
          resolve(snapshot.val())
        })
    }),
    createOne (args: BattleCreate) {
      const id = new UId()
      const ref = `battles/${id.id}`

      const battle = {
        id: id.id,
        players: args.players,
        winner: null,
        loser: null,
        isComplete: false,
        createdAt: Date.now()
      }

      return db
        .ref(ref)
        .set({ ...battle })
        .then(() => battle)
    }
  },
  players: {
    createOne (args: PlayerCreate) {
      const ref = `players/${args.id}`

      const hero = {
        id: args.id,
        name: args.name,
        hero: args.hero,
        createdAt: Date.now(),
        wannaBattle: false,
        battleId: null
      }

      return db
        .ref(ref)
        .set({ ...hero })
        .then(() => hero)
    },
    findOneById: (id: string) => new Promise((resolve, reject) => {
      const ref = `players/${id}`

      return db
        .ref(ref)
        .once('value', (snapshot) => {
          resolve(snapshot.val())
        })
    }),
    findOneByName: (name: string) => new Promise((resolve, reject) => {
      const ref = 'players'

      return db
        .ref(ref)
        .orderByChild('name')
        .equalTo(name)
        .once('value', (snapshot) => {
          resolve(snapshot.val())
        })
    }),
    whoWannaBattle: () => new Promise((resolve, reject) => {
      const ref = 'players'

      return db
        .ref(ref)
        .orderByChild('wannaBattle')
        .equalTo(true)
        .once('value', (snapshot) => {
          resolve(obj2arr(snapshot.val()))
        })
    }),
    wannaBattle (id: string, either: boolean) {
      const ref = `players/${id}/wannaBattle`

      return db
        .ref(ref)
        .set(either)
    }
  }
}
