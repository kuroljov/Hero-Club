import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import { firebase } from './lib/firebase'

import ActionButton from './components/ActionButton'

import api from './lib/api'
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

  api.players.findOneById(id)
    .then((me) => {
      store.dispatch('me/addInfo', { ...me })

      if (me) {
        firebase
          .database()
          .ref(`players/${me.id}/battleId`)
          .on('value', (snapshot) => {
            const battleId = snapshot.val()

            if (!battleId) {
              return
            }

            app.$router.push({
              name: 'Battle',
              params: {
                battleId
              }
            })
          })

        if (me.battleId) {
          app.$router.push({
            name: 'Battle',
            params: {
              battleId: me.battleId
            }
          })
        } else {
          app.$router.push({ name: 'Home' })
        }
      } else {
        app.$router.push({ name: 'HeroPick' })
      }

      app.$mount('#app')

      loading.hide()
    })
    .catch(console.error)
})
