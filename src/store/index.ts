import { NWK } from "@/data/NWK";
import { InjectionKey } from "vue";
import {
  createLogger,
  createStore,
  useStore as baseUseStore,
  Store,
} from "vuex";

import { IUnReDoState, localStoragePlugin } from "./localStoragePlugin";
import { nwkModule } from "./nwkModule";
import { viewOptionsModule, ViewOptionsState } from "./viewOptionsModule";

export interface IStoreState {
  nwk: NWK;
  view: ViewOptionsState;
  unredo: IUnReDoState;
}

const plugins =
  process.env.NODE_ENV !== "production"
    ? [createLogger(), localStoragePlugin]
    : [localStoragePlugin];

export const store = createStore<IStoreState>({
  strict: process.env.NODE_ENV !== "production",
  modules: {
    nwk: nwkModule,
    view: viewOptionsModule,
  },
  plugins,
});

// TypeScript support <https://next.vuex.vuejs.org/guide/typescript-support.html#typing-usestore-composition-function>
// define injection key
export const key: InjectionKey<Store<IStoreState>> = Symbol();

// define your own `useStore` composition function
export function useStore(): Store<IStoreState> {
  return baseUseStore(key);
}
