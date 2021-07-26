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
import { defineComponent, computed } from "vue";
import { Ego } from "@/data/Ego";

export default defineComponent({
  props: {
    ego: {
      type: Object,
      required: true
    }
  },

  setup(props, {emit}) {
    const displayName = computed(() => {
      const egoTrimmed = props.ego.name.trim();
      return egoTrimmed.length > 0 ? egoTrimmed : "<Neue Ankerperson>";
    });

    return {
      displayName
    }
  }
});
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
