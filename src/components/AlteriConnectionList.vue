<template>
  <p class="label">Beziehungen von {{ alter.name }}</p>
  <p class="help">
    Klicke auf einen Kontakt um diesen mit {{ alter.name }} zu verbinden bzw.
    die Verbindung zu lösen.
  </p>

  <div class="columns">
    <div class="column">
      <p class="label">Mögliche Kontakte</p>
      <button
        v-for="other in altersNotConnected"
        :key="other.id"
        @click.stop="addConnection(other.id)"
        class="button is-fullwidth"
      >
        {{ displayName(other) }}
      </button>
    </div>
    <div class="column">
      <p class="label">Verbundene Kontakte</p>
      <button
        v-for="other in altersConnected"
        :key="other.id"
        @click.stop="removeConnection(other.id)"
        class="button is-fullwidth"
      >
        {{ displayName(other) }}
      </button>
    </div>
  </div>

  <div class="field is-grouped is-grouped-centered">
    <p class="control">
      <button @click.stop="editAlterFinished()" class="button is-primary">
        Fertig
      </button>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "@/store";
import { isConnectable } from "@/data/Alter";

export default defineComponent({
  props: {
    alter: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const connectedAlterIds = computed(() => {
      const myId = props.alter.id;
      const id1s = store.state.nwk.connections
        .filter((d) => d.id2 == myId)
        .map((d) => d.id1);
      const id2s = store.state.nwk.connections
        .filter((d) => d.id1 == myId)
        .map((d) => d.id2);
      return [...id1s, ...id2s];
    });

    // lists of alters are sorted in same order as in the main list
    const altersConnected = computed(() => {
      return store.state.nwk.alteri.filter((d) =>
        connectedAlterIds.value.includes(d.id)
      );
    });

    const altersNotConnected = computed(() => {
      return store.state.nwk.alteri.filter(
        (d) =>
          !connectedAlterIds.value.includes(d.id) &&
          d.id != props.alter.id &&
          isConnectable(d)
      );
    });

    return {
      altersConnected,
      altersNotConnected,

      // events --> mutations
      addConnection: (otherId: number) => {
        store.commit("addConnection", { id1: props.alter.id, id2: otherId });
      },
      removeConnection: (otherId: number) => {
        store.commit("removeConnection", {
          id1: props.alter.id,
          id2: otherId,
        });
      },
      editAlterFinished: () => store.commit("view/closeAlterForm"),
      displayName: store.getters["displayName"],
    };
  },
});
</script>

<style scoped lang="scss">
div.form {
  margin-top: 0.5em;
}
</style>
