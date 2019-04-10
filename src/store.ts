import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    activators: 1,
    nonActivators: 1
  },
  mutations: {
    setActivators(state, num: number) {
      state.activators = num;
    },
    setNonActivators(state, num: number) {
      state.nonActivators = num;
    },
  },
  actions: {
    setActivators(context, num: number) {
      context.commit('setActivators', num);
    },
    setNonActivators(context, num: number) {
      context.commit('setNonActivators', num);
    },
  },
});
