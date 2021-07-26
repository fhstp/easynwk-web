<template>
  <div id="ego">
    {{ displayName }}
    &nbsp;
    <button
      class="button is-small"
      title="Ankerperson bearbeiten"
      v-on:click="$emit('edit')"
    >
      <span class="icon">
        <font-awesome-icon icon="pencil-alt" />
      </span>
    </button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// import { Component, Prop, Vue } from "vue-property-decorator";
import { Ego } from "@/data/Ego";

@Options({
  props: {
    ego: Object,
  },
})
export default class EgoHeader extends Vue {
  private ego!: Ego;

  constructor() {
    super();
  }

  get displayName() {
    const egoTrimmed = this.ego.name.trim();
    return egoTrimmed.length > 0 ? egoTrimmed : "<Neue Ankerperson>";
  }
}
</script>

<style scoped>
#ego {
  display: flex;
  align-items: center;
}

#ego > :last-child {
  margin-left: 0.8em;
}
</style>
