<template>
  <section v-if="!loading">
    <div v-if="battle.isComplete">
      <h1>{{ winMessage }}</h1>
      <button @click="goHome">Go Home</button>
    </div>
    <div v-else>
      <h1>You are battling with {{ opponent.name }}</h1>

      <h3>Your Health: {{ myHealth }}/{{ me.hero.health }}</h3>
      <h3>His Health: {{ opponentHealth }}/{{ opponent.hero.health }}</h3>

      <h3>What to attack</h3>
      <ul>
        <li
          v-for="part in parts"
          :class="part === attack ? 'active' : ''"
          @click="attack = part"
        >{{ part }}</li>
      </ul>

      <h3>What to defend</h3>
      <ul>
        <li
          v-for="part in parts"
          :class="part === defend ? 'active' : ''"
          @click="defend = part"
        >{{ part }}</li>
      </ul>

      <div>
        <p v-if="myHitsCount > opponentHitsCount">Waiting for {{ opponent.name }} to Hit</p>
        <button v-else @click="commit">Commit</button>
      </div>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'

  import api from '../lib/api'
  import { db } from '../lib/firebase'
  import obj2arr from '../lib/obj2arr'
  import loading from '../lib/loading'

  export default {
    name: 'Battle',
    data: () => ({
      battle: {},
      opponent: {},
      attack: null,
      defend: null,
      loading: true,
      finalMessage: null
    }),
    watch: {
      'battle.hits.opponent' () {
        if (this.myHealth <= 0 || this.opponentHealth <= 0) {
          this.endOfBattle()
        }
      }
    },
    computed: {
      ...mapGetters('me', ['me']),
      winner () {
        return this.battle.winnerId === this.me.id ? this.me : this.opponent
      },
      winMessage () {
        if (this.winner.id === this.me.id) {
          return 'You Won!'
        }

        return 'You Lost!'
      },
      myHealth () {
        const base = this.me.hero.health

        if (!this.battle.hits.me.length) {
          return base
        }

        return this.battle.hits.me
          .reduce((health: number, hit: Object, index: number) => {
            const me = hit
            const op = this.battle.hits.opponent[index]

            if (!me || !op) {
              return health
            }

            if (op.attack !== me.defend) {
              health -= this.opponent.hero.damage[0]
            }

            return health
          }, base)
      },
      opponentHealth () {
        const base = this.opponent.hero.health

        if (!this.battle.hits.opponent.length) {
          return base
        }

        return this.battle.hits.opponent
          .reduce((health: number, hit: Object, index: number) => {
            const op = hit
            const me = this.battle.hits.me[index]

            if (!me || !op) {
              return health
            }

            if (me.attack !== op.defend) {
              health -= this.me.hero.damage[0]
            }

            return health
          }, base)
      },
      parts () {
        return ['Head', 'Body', 'Feet']
      },
      myHitsCount () {
        return this.battle.hits.me.length
      },
      opponentHitsCount () {
        return this.battle.hits.opponent.length
      }
    },
    async created () {
      const { battleId } = this.$route.params
      const battle = await api.battle.findOneById(battleId)

      const meId = this.me.id
      const opponentId = battle.players.filter(id => id !== meId)[0]

      const opponent = await api.players.findOneById(opponentId)

      this.opponent = opponent

      if (battle.isComplete) {
        this.battle = {
          ...battle,
          hits: {
            me: obj2arr(battle.hits && battle.hits[meId]),
            opponent: obj2arr(battle.hits && battle.hits[opponentId])
          }
        }

        this.loading = false
        loading.hide()

        return
      }

      db.ref(`players/${this.me.id}/wannaBattle`).set(false)
      db.ref(`players/${opponent.id}/wannaBattle`).set(false)

      db
        .ref(`battles/${battleId}`)
        .on('value', (snapshot) => {
          const battle = snapshot.val()

          this.battle = {
            ...battle,
            hits: {
              me: obj2arr(battle.hits && battle.hits[meId]),
              opponent: obj2arr(battle.hits && battle.hits[opponentId])
            }
          }

          this.loading = false
          loading.hide()
        })
    },
    methods: {
      goHome () {
        this.$router.push({ name: 'Home' })
      },
      endOfBattle () {
        if (this.myHealth <= 0 && this.opponentHealth > 0) {
          db.ref(`battles/${this.battle.id}/winnerId`).set(this.opponent.id)
        } else if (this.opponentHealth <= 0 && this.myHealth > 0) {
          db.ref(`battles/${this.battle.id}/winnerId`).set(this.me.id)
        }

        db.ref(`battles/${this.battle.id}/isComplete`).set(true)
        db.ref(`players/${this.me.id}/battleId`).set(null)
        db.ref(`players/${this.opponent.id}/battleId`).set(null)
      },
      commit () {
        db
          .ref(`battles/${this.battle.id}/hits/${this.me.id}`)
          .push({
            attack: this.attack,
            defend: this.defend
          })
          .then(() => {
            this.attack = null
            this.defend = null
          })
      }
    }
  }
</script>

<style scoped>
  .active {
    font-weight: bold;
  }
</style>
