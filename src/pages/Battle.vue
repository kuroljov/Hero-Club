<template>
  <section>
    <h1>You are battling with {{ opponent.name }}</h1>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'
  import api from '../lib/api'

  export default {
    name: 'Battle',
    data: () => ({
      battle: {},
      opponent: {}
    }),
    async beforeMount () {
      const { battleId } = this.$route.params

      this.battle = await api.battle.findOneById(battleId)

      const opponentId = this.battle.players.filter(id => id !== this.me.id)[0]

      this.opponent = await api.players.findOneById(opponentId)
    },
    computed: {
      ...mapGetters('me', ['me'])
    }
  }
</script>
