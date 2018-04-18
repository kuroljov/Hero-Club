// @flow

import { db } from './firebase'
import type { Hero } from '../types/Hero'
import obj2arr from './obj2arr'

type PlayerCreate = {
  id: string,
  name: string,
  hero: Hero,
}

export default {
  players: {
    createOne (args: PlayerCreate) {
      const ref = `players/${args.id}`

      const hero = {
        id: args.id,
        name: args.name,
        hero: args.hero,
        createdAt: Date.now(),
        wannaBattle: false
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
