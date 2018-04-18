<template>
  <section class="pick-hero">
    <div class="name-hero">
      <p>Name your character</p>
      <input type="text" id="name" v-model="name">
    </div>

    <div class="class-container">
      <div class="class-item" @click="pickHero('Barb')" :class="hero && hero.type === 'Barb' ? 'active' : ''">
        <p class="class-name">Barbarian</p>
        <p class="class-desc">A true warior with high combat skills</p>
        <ul class="skills">
          <li>Hight Physical Damage</li>
          <li>Low Health</li>
        </ul>
      </div>
      <div class="class-item" @click="pickHero('Sorc')" :class="hero && hero.type === 'Sorc' ? 'active' : ''">
        <p class="class-name">Sorceress</p>
        <p class="class-desc">Master of the elemental Magic</p>
        <ul class="skills">
          <li>Low Magic Damage</li>
          <li>Hight Health</li>
        </ul>
      </div>
    </div>

    <v-action-button :icon="arrowRightIcon" :disabled="!isDone" @click.native="done"></v-action-button>
  </section>
</template>

<script>
  import { mapActions } from 'vuex'
  import heroes from '../lib/heroes'
  import api from '../lib/api'
  import arrowRightIcon from '../assets/arrow-right.svg'

  export default {
    name: 'HeroPick',
    data: () => ({
      name: null,
      hero: null
    }),
    computed: {
      arrowRightIcon: () => arrowRightIcon,
      isDone () {
        return !!this.name && !!this.hero
      }
    },
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
  .pick-hero {
    text-align: center;
  }
  .name-hero {
    margin: 2rem;
  }
  input {
    padding: .5rem;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: .2rem;
    text-align: center;
  }
  .class-item {
    padding: 1rem;
    margin: 0;
    border-bottom: 1px solid #eee;
  }
  .class-item:nth-last-child(1) {
    border-bottom: none;
    margin-bottom: 1.5rem;
  }
  button {
    background: #3F51B5;
    border: none;
    outline: none;
    color: white;
    padding: .4rem 1rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-bottom: 1rem;
  }
  .class-name {
    font-size: 1.4rem;
  }
  .class-item.active {
    background: #f5f5f5;
  }
</style>
