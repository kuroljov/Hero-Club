// @flow

import Vue from 'vue'
import Vuex, { Store } from 'vuex'

Vue.use(Vuex)

export default new Store({
  strict: true,
  state: {
    name: 'John Doe'
  }
})
