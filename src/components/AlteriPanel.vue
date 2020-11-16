<template>
  <nav class="panel">
    <p class="panel-heading">
      <span>Kontakte</span>
      <span class="buttons are-small">
        <button class="button">
          <span class="icon is-small">
            <font-awesome-icon icon="user-plus" />
          </span>
        </button>
        <button class="button">
          <span class="icon is-small">
            <font-awesome-icon icon="exchange-alt" rotation="90" />
          </span>
        </button>
      </span>
    </p>
    <AlteriPanelEntry
      v-for="alter in alteri.getAlteri()"
      :key="alter.id"
      v-bind:alter="alter"
    ></AlteriPanelEntry>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AlteriPanelEntry from "@/components/AlteriPanelEntry.vue";
// import { Alter } from "@/data/Alter";
import { AlteriList } from "@/data/AlteriList";

@Component({
  components: {
    AlteriPanelEntry
  }
})
export default class AlteriPanel extends Vue {
  @Prop(AlteriList) private alteri!: AlteriList;

  constructor() {
    super();
  }
}
</script>

<style scoped>
.panel-heading .buttons {
  float: right;
}

.panel-block.alteri-form {
  display: block;
}

.panel-block,
.panel-heading,
.panel-tabs {
  border-bottom: 1px solid #dbdbdb;
  border-left: 1px solid #dbdbdb;
  border-right: 1px solid #dbdbdb;
}
</style>
