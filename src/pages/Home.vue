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

        const firstBattler = battlers[0]

        await this.createBattle({
          opponent: firstBattler
        })
      }
    }
  }
</script>
