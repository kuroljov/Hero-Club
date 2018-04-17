import Vue from 'vue'
import Router from 'vue-router'

import HeroPick from '../pages/HeroPick'
import Home from '../pages/Home'

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
  }]
})
