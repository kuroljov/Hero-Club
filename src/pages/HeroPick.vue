<template>
  <section>
    <div>
      <p>Name your character</p>
      <input type="text" id="name" v-model="name">
    </div>

    <div class="class-container">
      <div class="class-item" @click="pickHero('Barb')">
        <p class="class-name">Barbarian</p>
        <p class="class-desc">A true warior with high combat skills</p>
        <ul class="skills">
          <li>Hight Physical Damage</li>
          <li>Low Health</li>
        </ul>
      </div>
      <div class="class-item" @click="pickHero('Sorc')">
        <p class="class-name">Sorceress</p>
        <p class="class-desc">Master of the elemental Magic</p>
        <ul class="skills">
          <li>Low Magic Damage</li>
          <li>Hight Health</li>
        </ul>
      </div>
    </div>

    <button @click="done">Done</button>
  </section>
</template>

<script>
  import { mapActions } from 'vuex'
  import heroes from '../lib/heroes'
  import api from '../lib/api'

  export default {
    name: 'HeroPick',
    data: () => ({
      name: null,
      hero: null
    }),
    methods: {
      ...mapActions('me', ['addInfo', 'createPlayer']),
      goHome () {
        this.$router.push({ name: 'Home' })
      },
      pickHero (type: string) {
        this.hero = heroes[type]
      },
      async done () {
        const { name, hero } = this

        if (!name || !hero) {
          return
        }

        const player = await api.players.findOneByName(name)

        if (player) {
          console.log('Player with this name exists')
          return
        }

        await this.createPlayer({ name, hero })

        this.goHome()
      }
    }
  }
</script>

<style scoped>
  .class-item {
    background: #eee;
    padding: 1rem;
    margin: 1rem 0;
  }
</style>
