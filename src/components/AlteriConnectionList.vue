<template>
  <p class="label">{{ translate("relationsMsg1") }} {{ alter.name }}</p>
  <p class="help">
    {{ translate("relationsMsg2") }}{{ alter.name }}
    {{ translate("relationsMsg3") }}
  </p>

  <div class="columns">
    <div class="column">
      <p class="label">{{ translate("contactsMsg1") }}</p>
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
      <p class="label">{{ translate("contactsMsg") }}</p>
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
        {{ translate("doneMsg") }}
      </button>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "@/store";
import { isConnectable } from "@/data/Alter";
import de from "@/de.ts";
import en from "@/en.ts";

export default defineComponent({
  mixins: [de, en],
  methods: {
    translate(prop: string) {
      console.log(document.documentElement.lang);
      return this[document.documentElement.lang][prop];
    },
  },
  data() {
    return {
      lang: "de",
    };
  },
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
