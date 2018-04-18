<template>
  <section class="home">
    <header>
      <h1 class="name">{{ me.name }}</h1>
    </header>

    <main class="about">
      <h3 class="type">{{ me.hero.type }}</h3>
      <h3>Health: {{ me.hero.health }}</h3>
      <h3>Damage: {{ me.hero.damage.join('-') }}</h3>
    </main>

    <div class="searching" v-if="me.wannaBattle">
      <h3>Battle will happen soon. I can feel it!</h3>
      <button class="cancel-btn" @click="runAway">Run away</button>
    </div>

    <v-action-button v-if="!me.wannaBattle" @click.native="battle" :icon="axeIcon"></v-action-button>
  </section>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import api from '../lib/api'
  import { db } from '../lib/firebase'
  import axeIcon from '../assets/axe.svg'

  export default {
    name: 'Home',
    computed: {
      ...mapGetters('me', ['me']),
      axeIcon: () => axeIcon
    },
    methods: {
      ...mapActions('me', ['meWannaBattle']),
      ...mapActions('battle', ['createBattle']),
      runAway () {
        this.meWannaBattle(false)
      },
      async battle () {
        const battlers = await api.players.whoWannaBattle()

        if (!battlers.length) {
          return this.meWannaBattle(true)
        }

        const opponent = battlers[0]

        const battle = await this.createBattle({
          opponent
        })

        db.ref(`players/${this.me.id}/battleId`).set(battle.id)
        db.ref(`players/${opponent.id}/battleId`).set(battle.id)
      }
    }
  }
</script>

<style scoped>
  .home {
    text-align: center;
  }
  .about {
    margin-top: 3rem;
  }
  button {
    background: none;
    border: 1px solid #ddd;
    outline: none;
    padding: .4rem;
    text-transform: uppercase;
    font-size: .8rem;
    color: #333;
    font-weight: bold;
  }
  .searching {
    background: #fafafa;
    margin-top: 3rem;
    padding: 1rem 2rem 2rem;
  }
  .cancel-btn {
    background: white;
  }
</style>
