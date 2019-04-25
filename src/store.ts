import Vue from 'vue';
import Vuex from 'vuex';

import _ from 'lodash';

Vue.use(Vuex);

interface ICycle {
  cursor: number;
  length: number;
}

const startingCycles: ICycle[] = [
  { cursor: 1, length: 2 },
  { cursor: 3, length: 3 },
];

export default new Vuex.Store({
  state: {
    asm: {
      activators: 1,
      nonActivators: 1,
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
    setActivators(state, payload: number) {
      state.asm.activators = Number(payload);
      const cycleLength = state.asm.activators + state.asm.nonActivators;
      state.asm.cycles = [
        { cursor: 1, length: cycleLength },
        { cursor: cycleLength + 1, length: cycleLength + 1 },
      ];;
    },
    setNonActivators(state, payload: number) {
      state.asm.nonActivators = Number(payload);
      const cycleLength = state.asm.activators + state.asm.nonActivators;
      state.asm.cycles = [
        { cursor: 1, length: cycleLength },
        { cursor: cycleLength + 1, length: cycleLength + 1 },
      ];;
    },
    incrementIteration(state) {
      state.asm.iteration++;
      state.asm.cycles[state.asm.cycles.length].length++
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
        length: state.asm.iteration + state.asm.activators + state.asm.nonActivators + 1,
      };
      state.asm.cycles.push(newCycle);
    },
  },
  actions: {
    nextState({ commit, getters }) {
      commit('incrementActiveIndices');
      if (!getters.anyActive) { commit('addCycle'); }
      commit('incrementIteration');
    },
    setActivators({ commit }, payload: number) {
      commit('setActivators', payload);
    },
    setNonActivators({ commit }, payload: number) {
      commit('setNonActivators', payload);
    },
  },
});
