import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import { db, firebase } from './lib/firebase'

import ActionButton from './components/ActionButton'

import loading from './lib/loading'

Vue.config.productionTip = false

Vue.component('v-action-button', ActionButton)

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

  store.commit('me/addInfo', { id })

  db
    .ref(`players/${id}`)
    .on('value', (snapshot) => {
      const me = snapshot.val()

      if (!me) {
        app.$router.push({ name: 'HeroPick' })

        app.$mount('#app')
        loading.hide()
        return
      }

      store.commit('me/addInfo', { ...me })

      if (me.battleId) {
        app.$router.push({
          name: 'Battle',
          params: {
            battleId: me.battleId
          }
        })
      }

      app.$mount('#app')
      loading.hide()
    })
})
