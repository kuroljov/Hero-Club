import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import { firebase } from './lib/firebase'

import api from './lib/api'
import loading from './lib/loading'

Vue.config.productionTip = false

const app = new Vue({
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

  api.players.findOneById(id)
    .then((me) => {
      store.dispatch('me/addInfo', { ...me })

      if (me) {
        app.$router.push({ name: 'Home' })
      } else {
        app.$router.push({ name: 'HeroPick' })
      }

      app.$mount('#app')

      loading.hide()
    })
    .catch(console.error)
})
