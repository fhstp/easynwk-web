<template>
  <div>
    <!-- <div id="alterFields" v-if="addAlterPageVisible">
      <h2 id="contactListTitleHeading" class="inlineElement textLeft alterListFont">Kontakte:</h2>
      <img
        id="addAlterIcon"
        class="iconRight"
        src="../assets/addAlter.svg"
        alt="Kontakt hinzufügen"
        @click="addAlter()"
      />
      <div id="listOfAlter">
        <ul>
          <li v-bind:key="alterN.id" v-for="alterN in alter">
            <div>
              <h2 class="alterListFont">{{ alterN.name }}/{{ alterN.role }}</h2>
            </div>
          </li>
        </ul>
      </div>
    </div>-->
    <div v-if="!addAlterPageVisible">
      <!-- <img
        class="iconLeft"
        src="../assets/closeCreateNewAlter.svg"
        alt="Schließen"
        @click="closeCreateNewAlter()"
      />-->
      <p>Name:</p>
      <input type="text" v-model="unsavedAlter.name" />
      <!-- <p>Beziehungstyp:</p>
      <v-select v-model="unsavedAlter.role" v-bind:options="roles"></v-select>
      <p>Geschlecht:</p>
      <v-select v-model="unsavedAlter.currentGender" v-bind:options="gender"></v-select>
      <p>Alter:</p>
      <input type="text" v-model="unsavedAlter.age" />
      <p>Notiz:</p>
      <input type="text" class="note" v-model="unsavedAlter.note" />-->

      <button @click="func">Fertig</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import AlterInterface from "./AlterInterface.vue";
import { v4 as uuid } from "uuid";

export default class Alter extends Vue {
  @Prop(Array) private alter!: Array<AlterInterface>;
  @Prop() private gender!: Array<string>;
  @Prop(Array) private roles!: Array<string>;
  @Prop() private unsavedAlter!: AlterInterface;
  @Prop(Array) private amountOfEdges!: Array<number>;
  @Prop(Boolean) private addAlterPageVisible!: boolean;

  constructor() {
    super();
    this.addAlterPageVisible = false;
    this.roles = ["Fr", "Fa", "Ko", "He"];
    this.gender = ["männlich", "weiblich", "divers"];
    this.amountOfEdges = [0, 1, 2];
    this.unsavedAlter = {
      id: uuid(),
      name: "",
      gender: this.gender,
      role: "",
      note: "",
      amountOfEdges: 0
    };
    if (localStorage.newAlterName) {
      this.unsavedAlter = localStorage.newAlterName;
    }
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
  @Watch("unsavedAlter")
  onNameChange(newName: string) {
    if (this.alter) {
      localStorage.newAlterName = newName;
    }
  }

  addAlter() {
    this.addAlterPageVisible = true;
  }

  closeCreateNewAlter() {
    this.addAlterPageVisible = false;
  }
}
</script>
<style scoped>
#contactListTitleHeading {
  margin: 0px;
  padding: 10px;
  padding-left: 10px;
  padding-top: 10px;
}
.alterListFont {
  font-size: 24px;
}
#addAlterIcon {
  padding: 15px;
  padding-right: 17px;
}
</style>

