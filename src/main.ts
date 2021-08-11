import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { store, key } from "./store";

require("@/assets/main.scss");

// BEGIN fontawesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// NB: import & add each used icon here
import {
  faBars,
  faPencilAlt,
  faUserPlus,
  faMapPin,
  faUserMinus,
  faExchangeAlt,
  faProjectDiagram,
  faExclamationTriangle,
  faTimes,
  faFolderOpen,
  faFile,
  faSave,
  // faChevronDown,
  // faUndoAlt,
  // faRedoAlt,
  faUndo,
  faRedo,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faBars,
  faPencilAlt,
  faUserPlus,
  faMapPin,
  faUserMinus,
  faExchangeAlt,
  faProjectDiagram,
  faExclamationTriangle,
  faTimes,
  faFolderOpen,
  faFile,
  faSave,
  // faChevronDown,
  // faUndoAlt,
  // faRedoAlt,
  faUndo,
  faRedo,
  faCheck
);

// Vue.component("font-awesome-icon", FontAwesomeIcon);

// NB: activate, if icons should also be added the traditional way with i tags
// import { dom } from '@fortawesome/fontawesome-svg-core'
// dom.watch() // This will kick of the initial replacement of i to svg tags and configure a MutationObserver
// END fontawesome

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(store, key)
  .use(router)
  .mount("#app");
