<template>
  <div id="ego">
    Ankerperson:&nbsp;
    <b>{{ displayName }}</b>
    &nbsp;
    <span v-if="egoAge">/ {{ egoAge }} </span>
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
import { useStore } from "@/store";
// import { Ego } from "@/data/Ego";

export default defineComponent({
  setup() {
    const store = useStore();

    const displayName = computed(() => {
      const egoTrimmed = store.state.nwk.ego.name.trim();
      return egoTrimmed.length > 0 ? egoTrimmed : "<Neue Ankerperson>";
    });

    return {
      displayName,
      egoAge: computed(() => store.state.nwk.ego.age),
    };
  },
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
