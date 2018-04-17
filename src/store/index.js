// @flow

import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import me from './me'

Vue.use(Vuex)

export default new Store({
  strict: true,
  modules: {
    me
  }
})
