<template>
  <section v-if="!loading" class="battle">
    <div v-if="battle.isComplete" class="battle-end">
      <div class="header">
        <h1 :class="winner.id === me.id ? 'green' : 'red'">{{ winMessage }}</h1>
      </div>
      <div class="actions">
        <button @click="goHome">Go Home</button>
      </div>
    </div>
    <div v-else class="battlefield">
      <header class="header">
        <h1 class="versus">Versus {{ opponent.name }}</h1>
        <p class="opponent-health">{{ opponentHealth }}</p>
      </header>

      <div class="row">
        <div class="col">
          <div class="label-value">
            <p class="label">Health</p>
            <p class="value health">{{ myHealth }}</p>
          </div>
        </div>
        <div class="col">
          <div class="label-value">
            <p class="label">Damage</p>
            <p class="value">{{ me.hero.damage.join('-') }}</p>
          </div>
        </div>
      </div>

      <h3>Attack</h3>

      <div class="row">
        <div
          class="col"
          v-for="part in parts"
          @click="attack = part"
          :class="part === attack ? 'active' : ''"
        >
          <div class="part">
            <p class="part-name">{{ part }}</p>
          </div>
        </div>
      </div>

      <h3>Defend</h3>

      <div class="row">
        <div
          class="col"
          v-for="part in parts"
          @click="defend = part"
          :class="part === defend ? 'active' : ''"
        >
          <div class="part">
            <p class="part-name">{{ part }}</p>
          </div>
        </div>
      </div>

      <v-action-button
        :icon="axeIcon"
        :disabled="myHitsCount > opponentHitsCount"
        @click.native="commit"
        ></v-action-button>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'

  import api from '../lib/api'
  import { db } from '../lib/firebase'
  import obj2arr from '../lib/obj2arr'
  import loading from '../lib/loading'
  import axeIcon from '../assets/axe.svg'
  import calcDamage from '../lib/calcDamage'

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
      axeIcon: () => axeIcon,
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
              health -= calcDamage(this.opponent.hero)
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
              health -= calcDamage(this.me.hero)
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
        if (!this.attack || !this.defend) {
          alert('Choose attack and defend')
          return
        }

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
  .battle {
    text-align: center;
  }
  .row {
    display: flex;
    justify-content: space-between;
  }
  .col {
    flex: 1;
  }
  .part {
    text-align: center;
    margin: 1rem 0;
  }
  .active {
    background: #f5f5f5;
  }
  .part-name {
    margin: 0;
  }
  .row {
    margin-bottom: 2rem;
  }
  .health {
    color: #E91E63;
  }
  .value {
    font-size: 1.4rem;
  }
  .opponent-health {
    margin: 0;
    margin-top: -1.5rem;
    color: #E91E63;
    font-size: 1.2rem;
  }
  .header {
    margin-bottom: 1rem;
  }
  .battle-end {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  button {
    background: white;
    border: 1px solid #ddd;
    outline: none;
    font-size: .8rem;
    text-transform: uppercase;
    padding: .4rem;
  }
  .green {
    color: #4CAF50;
  }
  .red {
    color: #F44336;
  }
</style>
