<template>
  <section>
    <h1>Home</h1>
    <button @click="battle">Go Battle</button>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { db } from '../lib/firebase'

  export default {
    name: 'Home',
    data: () => ({
      notBusy: []
    }),
    mounted () {
      this.findOpponents()
    },
    computed: {
      ...mapGetters('me', {
        myId: 'id'
      })
    },
    methods: {
      findOpponents () {
        db
          .ref('players')
          .orderByChild('isBusy')
          .equalTo(false)
          .once('value', (snapshot) => {
            const players: Object = snapshot.val()

            if (!players) {
              return
            }

            this.notBusy = Object
              .keys(players)
              .reduce((acc: Array<Object>, playerId: string) => {
                const player = players[playerId]

                acc.push(player)

                return acc
              }, [])
              .filter(player => player.id !== this.myId)
          })
      },
      battle () {
        // get one available player from firebase
        // setup a battle with him
      }
    }
  }
</script>
