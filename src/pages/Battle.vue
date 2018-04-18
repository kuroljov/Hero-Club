<template>
  <section>
    <h1>You are battling with {{ opponent.name }}</h1>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Battle',
    computed: {
      ...mapGetters('battle', ['opponent'])
    }
  }
</script>
