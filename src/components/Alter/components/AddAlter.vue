<template>
  <div>
    <img
      class="iconLeft"
      src="../assets/addNewAlter.svg"
      alt="Schließen"
      @click="openAlterListPage()"
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
import {Alter} from "@/data/Alter";
import { v4 as uuid } from "uuid";
import { Gender } from "@/data/Gender.ts";
import { Roles } from "@/data/Roles";
@Component
export default class AddAlter extends Vue {
  private unsavedAlter!: Alter;
  private gender!: typeof Gender;
  private roles!: typeof Roles;

  constructor() {
    super();
    this.gender = Gender;
    this.roles = Roles;
  }

  data() {
    return {
      unsavedAlter: {
        id: uuid(),
        name: "",
        role: "",
        note: "",
        currentGender: "",
        amountOfEdges: 0,
      },
    };
  }

  addAlter() {
    // this.alter[this.alter.length] = this.unsavedAlter;
    // localStorage.setItem("alter", JSON.stringify(this.alter));
    console.log("addAlter");
    this.$emit("add-alter", this.unsavedAlter);
    this.openAlterListPage();
  }
  openAlterListPage() {
    this.$emit("openAlterListPage");
  }
}
</script>
