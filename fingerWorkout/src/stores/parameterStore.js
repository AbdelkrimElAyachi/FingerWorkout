import { defineStore } from "pinia";

// parameter store used to store the tests parameter
// duration : (default : 1)
export const useParameterStore = defineStore("parameter", {
  state: () => ({ duration : 1 }),

  getters: {
    getDuration: (state) => state.duration,
  },

  actions: {
    setDuration(value) {
      this.duration = value;
    }
  }
});

