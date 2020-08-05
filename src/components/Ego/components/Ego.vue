<template>
  <div>
    <div id="title">
      <div id="egoTitle">
        <h1 class="inlineElement">Ich</h1>
        <h1 class="inlineElement" v-if="ego.name !== ''">
          :&nbsp;{{ ego.name }}
        </h1>
        <img
          v-if="egoSubmitted"
          class="iconRight"
          src="../assets/editEgo.svg"
          alt="Editieren"
          @click="editEgo()"
        />
      </div>
    </div>
    <div id="egoFields" v-if="!egoSubmitted">
      <h1>Ich</h1>
      <div class="egoSubDiv">
        <p class="textLeft">Name:</p>
        <br />
        <input
          type="text"
          class="inputOrDropdownRight"
          maxlength="16"
          v-model="ego.name"
        />
      </div>
      <div class="egoSubDiv">
        <p class="textLeft">Alter:</p>
        <br />
        <input type="text" class="inputOrDropdownRight" v-model="ego.age" />
      </div>
      <div class="egoSubDiv">
        <p class="textLeft">Geschlecht:</p>
        <br />
        <v-select
          id="egoGenderSelect"
          class="inputOrDropdownRight"
          v-model="ego.currentGender"
          v-bind:options="ego.gender"
        ></v-select>
      </div>

      <div class="egoSubDiv">
        <p class="textLeft">Notiz:</p>
        <br />
        <textarea
          class="inputOrDropdownRight note"
          type="text"
          v-model="ego.note"
        />
      </div>

      <div>
        <button @click="submit()">Bestätigen</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Ego from "./EgoInterface";
import { Gender } from "@/components/Gender.ts";

@Component
export default class EgoTitle extends Vue {
  private ego!: Ego;
  private gender!: typeof Gender;
  private egoSubmitted?: boolean = false;

  constructor() {
    super();
    if (localStorage.egoInitiallyDisplayed === "false") {
      this.egoSubmitted = true;
    }
    this.gender = Gender;
    this.ego = {
      name: "",
      age: "",
      gender: this.gender,
      currentGender: "",
      note: "",
    };
    if (localStorage.egoName) {
      this.ego.name = localStorage.egoName;
    }
    if (localStorage.egoAge) {
      this.ego.age = localStorage.egoAge;
    }
    if (localStorage.egoCurrentGender) {
      this.ego.currentGender = localStorage.egoCurrentGender;
    }
    if (localStorage.egoNote) {
      this.ego.note = localStorage.egoNote;
    }
  }

  @Watch("ego.name")
  onNameChange(newName: string) {
    if (this.ego) {
      localStorage.egoName = newName;
    }
  }

  @Watch("ego.age")
  onAgeChange(newAge: string) {
    if (this.ego) {
      localStorage.egoAge = newAge;
    }
  }
  @Watch("ego.currentGender")
  onCurrentGenderChange(newCurrentGender: string) {
    if (this.ego) {
      localStorage.egoCurrentGender = newCurrentGender;
      if (localStorage.egoCurrentGender === "null") {
        localStorage.egoCurrentGender = "";
      }
    }
  }
  @Watch("ego.note")
  onNoteChange(newNote: string) {
    if (this.ego) {
      localStorage.egoNote = newNote;
    }
  }

  get Name() {
    return this.ego && this.ego.name;
  }
  get Age() {
    return this.ego.age;
  }
  get Gender() {
    return this.ego.gender;
  }
  get Note() {
    return this.ego.note;
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  set Name(name: string) {
    this.ego.name = name;
  }
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  set Age(age: string) {
    this.ego.age = age;
  }
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  set Note(note: string) {
    this.ego.note = note;
  }
  parentSubmit() {
    this.$emit("submit");
    localStorage.egoInitiallyDisplayed = false;
  }
  submit() {
    this.egoSubmitted = true;
    // this.setTimeout is needed to let vue re-create the properties it needs to access
    setTimeout(this.parentSubmit, 0);
  }

  parentEditEgo() {
    this.$emit("editEgo");
  }
  editEgo() {
    this.egoSubmitted = false;
    localStorage.egoInitiallyDisplayed = true;
    // this.setTimeout is needed to let vue re-create the properties it needs to access
    setTimeout(this.parentEditEgo, 0);
  }
}
</script>
<style scoped>
#egoTitle {
  color: white;
  background-color: #ff8a00;
  padding: 5px;
  padding-top: 5px;
  padding-left: 15px;
}
#egoFields {
  width: 100%;
}
.egoSubDiv {
  display: inline-block;
  width: 100%;
}
#egoGenderSelect {
  /* I can't influence the height property */
  width: 285px;
  border: none;
  background-color: white;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  border-radius: 0%;
  margin-right: 10px;
}
</style>
