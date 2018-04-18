import Vue from 'vue'
import Router from 'vue-router'

import HeroPick from '../pages/HeroPick'
import Home from '../pages/Home'
import Battle from '../pages/Battle'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'HeroPick',
    component: HeroPick
  }, {
    path: '/home',
    name: 'Home',
    component: Home
  }, {
    path: '/battle/:battleId',
    name: 'Battle',
    component: Battle
  }]
})
