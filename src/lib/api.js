// @flow

import { db } from './firebase'
import type { Hero } from './heroes'

type PlayerCreate = {
  name: string,
  hero: Hero
}

export const Player = {
  findById: (id: string) => new Promise((resolve, reject) => {
    const ref = `players/${id}`

    return db
      .ref(ref)
      .once('value', (snapshot) => {
        resolve(snapshot.val())
      })
  }),
  create (args: PlayerCreate) {
    const ref = `players/${args.name}`

    const hero = {
      name: args.name,
      hero: args.hero,
      createdAt: Date.now()
    }

    return db
      .ref(ref)
      .set({ ...hero })
      .then(() => hero)
  }
}
