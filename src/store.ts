import Vue from 'vue';
import Vuex from 'vuex';

import _ from 'lodash';

Vue.use(Vuex);

interface ICycle {
  cursor: number;
  length: number;
}

const startingCycles: ICycle[] = [
  {cursor: 2, length: 2},
];

export default new Vuex.Store({
  state: {
    asm: {
      activators: 1,
      // cycles: new Array<ICycle>(),
      cycles: startingCycles,
      iteration: 0,
    },
  },
  getters: {
    anyActive(state): boolean {
      return _.some(state.asm.cycles, (cycle) => {
        return cycle.cursor <= state.asm.activators;
      });
    },
  },
  mutations: {
    incrementIteration(state) {
      state.asm.iteration++;
    },
    incrementActiveIndices(state) {
      state.asm.cycles.forEach((cycle) => {
        if (cycle.cursor >= cycle.length) {
          cycle.cursor = 1;
        } else {
          cycle.cursor++;
        }
      });
    },
    addCycle(state) {
      const newCycle: ICycle = {
        cursor: 1,
        length: state.asm.iteration + 3,
      };
      state.asm.cycles.push(newCycle);
    },
  },
  actions: {
    nextState({ commit, getters }) {
      if (!getters.anyActive) { commit('addCycle'); }
      commit('incrementActiveIndices');
      commit('incrementIteration');
    },
  },
});
