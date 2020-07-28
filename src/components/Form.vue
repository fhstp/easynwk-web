<template>
  <div>
    <div id="form">
      <div id="title">
        <div id="alterTitle" v-if="addAlterPageVisible">
          <h2>Neuer Kontakt: Erstellen</h2>
        </div>
      </div>
      <Ego v-if="!addAlterPageVisible" v-on:submit="submit()" />

      <div id="alterFields" v-if="egoSubmitted && !addAlterPageVisible">
        <div id="alterListTitle">
          <h2 id="contactListTitleHeading" class="inlineElement textLeft alterListFont">Kontakte:</h2>
          <img
            id="addAlterIcon"
            class="iconRight"
            src="../assets/addAlter.svg"
            alt="Kontakt hinzufügen"
            @click="addAlter()"
          />
        </div>
        <div id="listOfAlter">
          <ul>
            <li v-bind:key="alter.id" v-for="alter in alter">
              <div>
                <h2 class="alterListFont">{{ alter.name }}/{{ alter.role }}</h2>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="addAlterPageVisible">
        <img
          class="iconLeft"
          src="../assets/closeCreateNewAlter.svg"
          alt="Schließen"
          @click="closeCreateNewAlter()"
        />
        <p>Name:</p>
        <input type="text" v-model="unsavedAlter.name" />
        <!-- In the Figma-file there was: "Anonymes Zeichen" -->
        <p>Beziehungstyp:</p>
        <v-select v-model="unsavedAlter.role" v-bind:options="roles"></v-select>
        <p>Geschlecht:</p>
        <v-select v-model="unsavedAlter.currentGender" v-bind:options="gender"></v-select>
        <p>Alter:</p>
        <input type="text" v-model="unsavedAlter.age" />
        <p>Notiz:</p>
        <input type="text" class="note" v-model="unsavedAlter.note" />
        <!-- This following is a seperating line -->

        <button>Fertig</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { v4 as uuid } from "uuid";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Ego from "./Ego/components/Ego.vue";

Vue.component("v-select", vSelect);

Vue.component("Ego", Ego);

interface Alter {
  id: string;
  name: string;
  gender: Array<string>;
  role: string;
  note: string;
  amountOfEdges: number;
}

@Component
export default class Form extends Vue {
  //Global
  @Prop() private gender!: Array<string>;
  @Prop(Boolean) private egoSubmitted?: boolean = false;
  // Alter-related
  @Prop(Array) private alter!: Array<Alter>;
  @Prop(Array) private roles!: Array<string>;
  @Prop(Array) private amountOfEdges!: Array<number>;
  @Prop(Boolean) private addAlterPageVisible?: boolean = false;
  @Prop() private unsavedAlter!: Alter;

  /* // This watcher doesn't work. He would be for hecking ego.name for symbols and removing them
  @Watch("ego.name", { immediate: true, deep: true })
  nameField(newValue: string) {
    const re = /[^A-Z0-9]/gi;
    this.$set(this, this.ego.name, newValue.replace(re, ""));
  }
*/
  constructor() {
    super();
    this.roles = ["Fr", "Fa", "Ko", "He"];
    this.amountOfEdges = [0, 1, 2];

    // "alter" initialization
    this.alter = [
      {
        id: uuid(),
        name: "Alter 1",
        gender: this.gender,
        role: this.roles[0],
        note: "Alter note",
        amountOfEdges: 2
      },
      {
        id: uuid(),
        name: "Alter 2",
        gender: this.gender,
        role: this.roles[0],
        note: "Alter note",
        amountOfEdges: 1
      },
      {
        id: uuid(),
        name: "Alter 3",
        gender: this.gender,
        role: this.roles[1],
        note: "My new note",
        amountOfEdges: 0
      }
    ];
  }
  submit() {
    this.egoSubmitted = true;
  }
  editEgo() {
    this.egoSubmitted = false;
  }
  addAlter() {
    this.addAlterPageVisible = true;
    this.unsavedAlter = {
      id: uuid(),
      name: "",
      gender: this.gender,
      role: "",
      note: "",
      amountOfEdges: 0
    };
  }
  closeCreateNewAlter() {
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
#listOfAlter {
  margin-top: 50px;
}

#contactListTitleHeading {
  margin: 0px;
  padding: 5px;
  padding-left: 10px;
}

#alterListTitle {
  padding: 5px;
}
#addAlterIcon {
  padding: 5px;
}
.alterListFont {
  font-size: 24px;
}
</style>
