<template>
  <div>
    <div id="form">
      <div id="title">
        <div id="AddAlterTitle" v-if="addAlterPageVisible">
          <h2>Neuer Kontakt: Erstellen</h2>
        </div>
      </div>
      <!-- Through binding this dynamic class you can avoid having the vue-component reload itself and avoid having its variables be resetted -->
      <Ego
        v-bind:class="{ noDisplay: addAlterPageVisible }"
        v-on:submit="submitEgo()"
        v-on:editEgo="editEgo"
        v-bind:key="egoKey"
      />
      <AlterList
        v-on:openAddAlterPage="openAddAlterPage"
        v-if="egoSubmitted && !addAlterPageVisible"
        v-bind:alterarray="alter"
      />
      <AddAlter
        v-if="egoSubmitted && addAlterPageVisible"
        @add-alter="(a) => alter.push(a)"
        v-on:openAlterListPage="openAlterListPage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from "vue-property-decorator";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Ego from "./Ego/components/Ego.vue";
import AlterList from "./Alter/components/AlterList.vue";
import AddAlter from "./Alter/components/AddAlter.vue";
import { Alter } from "@/components/Alter/components/Alter";
import { local } from "d3";

Vue.component("v-select", vSelect);

Vue.component("Ego", Ego);
Vue.component("AlterList", AlterList);
Vue.component("AddAlter", AddAlter);

@Component
export default class Form extends Vue {
  private egoSubmitted?: boolean = false;
  private egoKey!: number;
  // private alterListKey!: number;
  private addAlterPageVisible?: boolean = false;
  private egoTitleV2Activated?: boolean = false;

  private alter = [] as Alter[];

  @Watch("alter")
  onAlterChange(newAlter: any) {
    localStorage.alter = JSON.stringify(newAlter);
  }

  constructor() {
    super();
    if (localStorage.egoInitiallyDisplayed === "false") {
      this.egoSubmitted = true;
    }
    if (localStorage.alter) {
      this.alter = JSON.parse(localStorage.alter);
    }
    if (localStorage.egoSubmitted) {
      this.egoSubmitted = localStorage.egoSubmitted;
    }
    if (localStorage.addAlterPageVisible) {
      this.addAlterPageVisible = localStorage.addAlterPageVisible;
    }
    this.egoKey = 0;
  }

  submitEgo() {
    this.egoSubmitted = true;
  }
  editEgo() {
    this.egoKey += 1;

    this.egoSubmitted = false;
  }
  openAddAlterPage() {
    this.addAlterPageVisible = true;
  }
  openAlterListPage() {
    this.addAlterPageVisible = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#form {
  display: inline-block;
  height: 609px; /*From the Figa´ma-file*/
  width: 548px; /*From the Figa´ma-file*/
  border-style: solid;
  border-width: 4px;
  border-color: black;
  margin: 5 auto;
  padding: 0px;
  background-color: #c4c4c4;
}

#title {
  text-align: left;
}

#alterTitle {
  color: grey;
  padding-left: 15px;
}

#alterListTitle {
  padding: 5px;
}
.noDisplay {
  display: none;
}
</style>
