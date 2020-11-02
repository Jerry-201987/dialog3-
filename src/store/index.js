import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
let store = new Vuex.Store({
    state: {
        nickname: "Simba",
        userlist: [
            { name: "aaa", gender: 0 },
            { name: "bbb", gender: 1 },
            { name: "ccc", gender: 1 },
            { name: "ddd", gender: 0 },
        ]
    },
    getters: {
        female(state) {
            return state.userlist.filter(r => !r.gender)
        },
        male(state) {
            return state.userlist.filter(r => r.gender)
        }
    },
    mutations: {
        setNickname(state, val) {
            state.nickname = val
        }
    },
    actions: {},
    modules: {}
})

export default store