<template>
  <button class="action-button" :disabled="disabled">
    <div class="icon" v-html="icon"></div>
  </button>
</template>

<script>
  export default {
    name: 'ActionButton',
    props: {
      icon: {
        type: String,
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>
  .icon {
    width: 2rem;
    height: 2rem;
  }
  .action-button {
    background: #3F51B5;
    fill: white;
    width: 4rem;
    height: 4rem;
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 .2rem .2rem 0 rgba(0, 0, 0, .1);
    border: none;
    outline: none;
    transition: 200ms ease;
  }
  .action-button[disabled] {
    background: #ddd;
  }
</style>
