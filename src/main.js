import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import { firebase } from './lib/firebase'

import 'normalize.css'
import { Player } from './lib/api'

Vue.config.productionTip = false

const app = new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App />'
})

firebase.auth().signInAnonymously()
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    console.log('User not logged In')
    return
  }

  const id = user.uid

  store.dispatch('me/addInfo', { id })

  Player.findById(id)
    .then((me) => {
      store.dispatch('me/addInfo', { ...me })

      app.$mount('#app')

      if (me) {
        app.$router.push({ name: 'Home' })
        return
      }

      app.$router.push({ name: 'HeroPick' })
    })
    .catch(console.error)
})
