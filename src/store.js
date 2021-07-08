import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

const vuexPersist = new VuexPersist({
  key: 'my-app',
  storage: window.localStorage
})

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [vuexPersist.plugin],
    state: {
      userInfo: null,
      bookInfo: null,
      categoryInfo: null,
      userAdminInfo: null,
      snack: null,
    },
    mutations: {
      SET_USER_INFO(state, payload) {
        state.userInfo = payload
      },
      RESET_USER_INFO(state) {
        state.userInfo = null
      },
      SET_BOOK_INFO(state, payload) {
        state.bookInfo = payload
      },
      RESET_BOOK_INFO(state) {
        state.bookInfo = null
      },
      SET_CATEGORY_INFO(state, payload) {
        state.categoryInfo = payload
      },
      RESET_CATEGORY_INFO(state) {
        state.categoryInfo = null
      },
      SET_USER_ADMIN_INFO(state, payload) {
        state.userAdminInfo = payload
      },
      RESET_USER_ADMIN_INFO(state) {
        state.userAdminInfo = null
      },
      SHOW_TOASK(state, payload) {
        state.snack = payload
      },
    },
    getters: {
      GET_USER_INFO(state) {
        return state.userInfo;
      },
      GET_TOKEN(state) {
        return state.userInfo && state.userInfo.token;
      },
      GET_ROLE(state) {
        return state.userInfo.data.user.role[0];
      },
      GET_BOOK_INFO(state) {
        return state.bookInfo;
      },
      GET_CATEGORY_INFO(state) {
        return state.categoryInfo;
      },
      GET_USER_ADMIN_INFO(state) {
        return state.userAdminInfo;
      },
    }
  })