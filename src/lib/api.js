// @flow

import { db } from './firebase'
import type { Hero } from './heroes'

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
    })
  }
}
