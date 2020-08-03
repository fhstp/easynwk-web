<template>
  <div>
    <img
      class="iconLeft"
      src="../assets/addNewAlter.svg"
      alt="Schließen"
      @click="addAlter()"
    />
    <p>Name:</p>
    <input type="text" v-model="unsavedAlter.name" />
    <p>Beziehungstyp:</p>
    <v-select v-model="unsavedAlter.role" v-bind:options="roles"></v-select>
    <p>Geschlecht:</p>
    <v-select
      v-model="unsavedAlter.currentGender"
      v-bind:options="gender"
    ></v-select>
    <p>Alter:</p>
    <input type="text" v-model="unsavedAlter.age" />
    <p>Notiz:</p>
    <input type="text" class="note" v-model="unsavedAlter.note" />

    <button @click="addAlter()">Fertig</button>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import AlterInterface from ".//AlterInterface.vue";
import { v4 as uuid } from "uuid";

export default class AddAlter extends Vue {
  @Prop() private unsavedAlter!: AlterInterface;
  @Prop() private gender!: Array<string>;
  constructor() {
    super();
    this.unsavedAlter = {
      id: uuid(),
      name: "",
      gender: this.gender,
      role: "",
      note: "",
      amountOfEdges: 0
    };
  }
  addAlter() {
    // this.alter[this.alter.length] = this.unsavedAlter;
    // localStorage.setItem("alter", JSON.stringify(this.alter));
    console.log("addAlter");
  }
}
</script>
