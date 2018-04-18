<template>
  <section>
    <h1>{{ me.name }}</h1>
    <hr>
    <h3>{{ me.hero.type }}</h3>
    <h3>Health: {{ me.hero.health }}</h3>
    <h3>Damage: {{ me.hero.damage.join('-') }}</h3>
    <button @click="battle">Wanna Battle</button>
  </section>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import api from '../lib/api'
  import { db } from '../lib/firebase'

  export default {
    name: 'Home',
    computed: {
      ...mapGetters('me', ['me'])
    },
    methods: {
      ...mapActions('me', ['meWannaBattle']),
      ...mapActions('battle', ['createBattle']),
      async battle () {
        const battlers = await api.players.whoWannaBattle()

        if (!battlers.length) {
          return this.meWannaBattle(true)
        }

        const opponent = battlers[0]

        const battle = await this.createBattle({
          opponent
        })

        db
          .ref(`players/${this.me.id}/battleId`)
          .set(battle.id)

        db
          .ref(`players/${opponent.id}/battleId`)
          .set(battle.id)
      }
    }
  }
</script>
