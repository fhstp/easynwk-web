<template>
  <div>
    <div id="egoForm">
      <div id="title">
        <h1 style="display:inline">Ich</h1>
        <h1 style="display:inline" v-if="ego.name !== ''">:&nbsp;{{ego.name}}</h1>
        <img
          style="float:right"
          src="../assets/Vector.png"
          alt="Editieren"
          v-if="egoSubmitted"
          @click="editEgo()"
        />
      </div>

      <div id="egoFields" v-if="!egoSubmitted">
        <h1>Ich</h1>
        <p>Name:</p>
        <input type="text" v-model="ego.name" />
        <p>Alter:</p>
        <input type="text" v-model="ego.age" />
        <p>Geschlecht:</p>
        <v-select v-bind:options="ego.gender"></v-select>
        <p>Notiz:</p>
        <input type="text" v-model="ego.note" />
        <div>
          <button @click="submit()">Bestätigen</button>
        </div>
      </div>
      <div id="alterFields" v-else-if="egoSubmitted">
        <h2>Kontakte:</h2>
        <ul>
          <li></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { v4 as uuid } from "uuid";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

Vue.component("v-select", vSelect);

interface Ego extends Object {
  name: string;
  age: string;
  gender: Array<string>;
  note: string;
}

interface Contact {
  id: string;
}

@Component
export default class HelloWorld extends Vue {
  @Prop() private ego!: Ego;
  @Prop(Boolean) private egoSubmitted?: boolean = false;
  @Prop(Array) private contacts!: Array<object>;

  constructor() {
    super();
    this.ego = {
      name: "",
      age: "",
      gender: ["männlich", "weiblich", "nicht angeben"],
      note: ""
    };
  }
  /*
 get Name() {
    return this.ego.name;
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
  */
  set Name(name: string) {
    this.ego.name = name;
  }
  set Age(age: string) {
    this.ego.age = age;
  }
  set Gender(gender: Array<string>) {
    this.ego.gender = gender;
  }
  set Note(note: string) {
    this.ego.note = note;
  }

  submit() {
    this.egoSubmitted = true;
  }
  editEgo() {
    this.egoSubmitted = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#egoForm {
  display: inline-block;
  height: 500px;
  width: 500px;
  border-style: solid;
  border-color: black;
  margin: 5 auto;
  padding: 10px;
}
#title {
  text-align: left;
}
button {
  margin: 10px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
