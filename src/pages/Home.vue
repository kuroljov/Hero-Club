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
      async battle () {
        const battlers = await api.players.whoWannaBattle()

        if (!battlers.length) {
          // if not - then set me.wannaBattle to true
          return this.meWannaBattle(true)
        }

        // if found anyone - then go battle with him
        console.log(battlers)
      }
    }
  }
</script>
