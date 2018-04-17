<template>
  <section>
    <h1>Home</h1>
    <button @click="battle">Go Battle</button>
  </section>
</template>

<script>
  export default {
    name: 'Home',
    methods: {
      battle () {
        // get one available player from firebase
        // setup a battle with him
      }
    }
  }
</script>
