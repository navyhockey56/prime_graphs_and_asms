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
      let isActive = false;
      state.asm.cycles.forEach((cycle) => {
        if (cycle.cursor <= state.asm.activators) {
          isActive = true;
        }
      });
      return isActive;
    },
    branchLength(state): number {
      return state.asm.iteration + state.asm.activators + state.asm.nonActivators + 1;
    },
  },
  mutations: {
    setActivators(state, payload: number) {
      state.asm.activators = Number(payload);
    },
    setNonActivators(state, payload: number) {
      state.asm.nonActivators = Number(payload);
    },
    resetCycles(state, getters) {
      const cycleLength = getters.branchLength - 1;
      state.asm.cycles = [
        { cursor: 1, length: cycleLength },
        { cursor: cycleLength + 1, length: cycleLength + 1 },
      ];
      state.asm.iteration = 0;
    },
    incrementIteration(state, getters) {
      state.asm.iteration++;
      const length = getters.branchLength;
      const cycle = _.last(state.asm.cycles);
      if (cycle != null) {
        cycle.cursor = length;
        cycle.length = length;
      }
    },
    incrementActiveIndices(state, getters) {
      state.asm.cycles.forEach((cycle) => {
        if (cycle.length >= getters.branchLength) {
          // Do nothing
        } else if (cycle.cursor >= cycle.length) {
          cycle.cursor = 1;
        } else {
          cycle.cursor++;
        }
      });
    },
    addCycle(state, getters) {
      const newCycle: ICycle = {
        cursor: 1,
        length: getters.branchLength,
      };
      const cycle = _.last(state.asm.cycles);
      if (cycle != null) {
        cycle.cursor = 1;
      }
      state.asm.cycles.push(newCycle);
    },
  },
  actions: {
    nextState({ commit, getters }) {
      commit('incrementActiveIndices', getters);
      if (!getters.anyActive) {
        commit('addCycle', getters);
      }
      commit('incrementIteration', getters);
    },
    setActivators({ commit, getters }, payload: number) {
      commit('setActivators', payload);
      commit('resetCycles', getters);
    },
    setNonActivators({ commit, getters }, payload: number) {
      commit('setNonActivators', payload);
      commit('resetCycles', getters);
    },
  },
});
