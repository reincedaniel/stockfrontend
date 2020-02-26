import Vue from 'vue'
import Vuex from 'vuex'

import login from './login'
import product from './product'
import category from './category'
import client from './client'
import article from './article'
import operation from './operation'
import provider from './provider'
import location from './location'
import profile from './profile'
import user from './user'
import input from './input'
import orderitem from './orderitem'
import material from './material'
import order from './order'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      login,
      product,
      category,
      client,
      article,
      operation,
      provider,
      location,
      user,
      profile,
      input,
      orderitem,
      material,
      order
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
