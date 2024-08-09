import type { ViewOptions, ViewOptionsFlags } from "@/data/ViewOptions";
import { loadViewSettingsFromStore } from "./localStoragePlugin";

const state = loadViewSettingsFromStore();

const getters = {};

const mutations = {
  update(state: ViewOptions, payload: Partial<ViewOptions>) {
    for (const field in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, field)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state as any)[field] = (payload as any)[field];
      }
    }
  },

  updateFlag(
    state: ViewOptions,
    payload: { flag: keyof ViewOptionsFlags; value: boolean }
  ) {
    state[payload.flag] = payload.value;
  },

  enable(state: ViewOptions, flag: keyof ViewOptionsFlags): void {
    state[flag] = true;
  },

  disable(state: ViewOptions, flag: keyof ViewOptionsFlags): void {
    state[flag] = false;
  },

  toggle(state: ViewOptions, flag: keyof ViewOptionsFlags): void {
    state[flag] = !state[flag];
  },

  setLabelSizeInNwk(state: ViewOptions, newSize: number): void {
    state.labelSizeInNwk = newSize;
  },
};

export const viewOptionsModule = {
  namespaced: true,
  state,
  getters,
  mutations,
};
