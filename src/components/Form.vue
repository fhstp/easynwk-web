<template>
  <div>
    <div id="form">
      <div id="title">
        <div id="AddAlterTitle" v-if="addAlterPageVisible">
          <h2>Neuer Kontakt: Erstellen</h2>
        </div>
      </div>
      <Ego
        v-if="!addAlterPageVisible"
        v-on:submit="submit()"
        v-on:editEgo="editEgo"
        v-bind:key="egoKey"
      />
      <AlterList
        v-on:openAddAlterPage="openAddAlterPage"
        v-if="egoSubmitted && !addAlterPageVisible"
      />
      <AddAlter v-if="egoSubmitted && addAlterPageVisible" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Ego from "./Ego/components/Ego.vue";
import AlterList from "./Alter/components/AlterList.vue";
import AddAlter from "./Alter/components/AddAlter.vue";

Vue.component("v-select", vSelect);

Vue.component("Ego", Ego);
Vue.component("AlterList", AlterList);
// Vue.component("AddAlter", AddAlter);

@Component
export default class Form extends Vue {
  @Prop(Boolean) private egoSubmitted!: boolean;
  @Prop() private egoKey!: number;
  @Prop() private alterListKey!: number;
  @Prop(Boolean) private addAlterPageVisible?: boolean = false;

  constructor() {
    super();
    this.egoKey = 0;

    this.egoSubmitted = false;
  }
  submit() {
    this.egoSubmitted = true;
  }
  editEgo() {
    this.egoKey += 1;

    this.egoSubmitted = false;
  }
  openAddAlterPage() {
    this.addAlterPageVisible = true;
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
</style>
