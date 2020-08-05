<template>
  <div>
    <NetworkMap v-bind:alteri="alteri" @map-click="mapclick" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import NetworkMap from "@/components/NetworkMap.vue";
import { Alter } from "@/components/Alter/components/Alter";

@Component({
  components: {
    NetworkMap,
  },
})
export default class MapParent extends Vue {
  // private ego: string;
  private alteri: Array<Alter>;

  constructor() {
    super();
    // this.ego = "Alex";
    this.alteri = [];
  }

  mapclick(coords: { distance: number; angle: number }) {
    console.log("map click in parent comp: ");
    localStorage.unsavedAlter = JSON.stringify(
      new Alter("", coords.angle, coords.distance)
    );
    localStorage.egoSubmitted = true;
    localStorage.addAlterPageVisible = true;
    this.$emit("reloadForm");
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
