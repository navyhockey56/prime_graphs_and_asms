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
      cycles: startingCycles,
      iteration: 0,
    },
  },
  getters: {
    anyActive(state): boolean {
      var isActive = false;
      state.asm.cycles.forEach((cycle) => {
        if (cycle.cursor <= state.asm.activators) {
          isActive = true;
        }
      });
      return isActive;
    },
  },
  mutations: {
    setActivators(state, payload: number) {
      state.asm.activators = Number(payload);
      const cycleLength = state.asm.activators + state.asm.nonActivators;
      state.asm.cycles = [
        { cursor: 1, length: cycleLength },
        { cursor: cycleLength + 1, length: cycleLength + 1 },
      ];
      state.asm.iteration = 0;
    },
    setNonActivators(state, payload: number) {
      state.asm.nonActivators = Number(payload);
      const cycleLength = state.asm.activators + state.asm.nonActivators;
      state.asm.cycles = [
        { cursor: 1, length: cycleLength },
        { cursor: cycleLength + 1, length: cycleLength + 1 },
      ];
      state.asm.iteration = 0;
    },
    incrementIteration(state) {
      state.asm.iteration++;
      const length = state.asm.iteration + state.asm.activators + state.asm.nonActivators + 1;
      state.asm.cycles[state.asm.cycles.length - 1].length = 0;
      state.asm.cycles[state.asm.cycles.length - 1].cursor = length;
      state.asm.cycles[state.asm.cycles.length - 1].length = length;
    },
    incrementActiveIndices(state) {
      state.asm.cycles.forEach((cycle) => {
        const length = state.asm.iteration + state.asm.activators + state.asm.nonActivators + 1;
        if (cycle.length >= length) {
          //Do nothing
        } else if (cycle.cursor >= cycle.length) {
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
      state.asm.cycles[state.asm.cycles.length - 1].cursor = 1;
      state.asm.cycles.push(newCycle);
    },
  },
  actions: {
    nextState({ commit, getters }) {
      commit('incrementActiveIndices');
      if (!getters.anyActive) {
        commit('addCycle');
      }
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
