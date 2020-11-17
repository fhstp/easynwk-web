<template>
  <div>
    <ul>
      <li v-for="cur in alteri" :key="cur.id">
        <b>{{ cur.name }}</b>
        {{ cur.angle }}, {{ cur.distance }}
      </li>
      <button @click="addRandomContact()">Add contact</button>
    </ul>
    <NetworkMap v-bind:alteri="alteri" @map-click="mapclick" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import NetworkMap from "@/components/NetworkMap.vue";
import { Alter } from "@/data/Alter";

@Component({
  components: {
    NetworkMap,
  },
})
export default class MapParent extends Vue {
  private ego: string;
  private alteri: Array<Alter>;

  constructor() {
    super();
    this.ego = "Alex";
    this.alteri = [
      // new Alter("Max", 30, 20),
      // new Alter("Klaus", 150, 90),
      // new Alter("Julia", -10, 50),
    ];
  }

  addRandomContact() {
    // const newAlter = initAlter() as Alter;
    // newAlter.name = "Neu";
    // newAlter.distance = Math.round(Math.random() * 100);
    // newAlter.angle = Math.round(Math.random() * 360 - 180,
    // this.alteri.push(newAlter);
  }

  mapclick(coords: { distance: number; angle: number }) {
    console.log("map click in parent comp: ");
    // this.alteri.push(new Alter("heya", coords.angle, coords.distance));
    console.log(coords);
  }
}
</script>

<style scoped>
ul {
  width: 200px;
}
svg {
  background: aliceblue;
  border: 1px solid red;
}
</style>
