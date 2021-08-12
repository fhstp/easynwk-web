<template>
  <p class="label">Beziehungen von {{ alter.name }}</p>
  <form class="form" @submit.prevent="editAlterFinished">
    <div class="columns">
      <div class="column">
        <div
          class="field is-horizontal"
          v-for="alter in relationsPart1"
          :key="alter.id"
        >
          <label class="checkbox">
            <input type="checkbox" />
            {{ alter.name }}
          </label>
        </div>
      </div>
      <div class="column">
        <div
          class="field is-horizontal"
          v-for="alter in relationsPart2"
          :key="alter.id"
        >
          <label class="checkbox">
            <input type="checkbox" />
            {{ alter.name }}
          </label>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal"></div>
      <div class="field-body"></div>
    </div>

    <div class="field is-grouped is-grouped-centered">
      <!-- <p class="control">
          <a class="button is-primary">
            Speichern
          </a>
        </p> -->
      <p class="control">
        <button class="button is-primary">Fertig</button>
      </p>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  props: {
    // gets Alter as prop cp. ToDo demo
    alter: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const possibleRelations = computed(() =>
      store.state.nwk.alteri.filter((d) => d.id != props.alter.id)
    );

    const relationsPart1 = computed(() => {
      const others = possibleRelations.value;
      return others.slice(0, (others.length + 1) / 2);
    });

    const relationsPart2 = computed(() => {
      const others = possibleRelations.value;
      return others.slice((others.length + 1) / 2, others.length);
    });

    const editAlterFinished = () => {
      store.commit("closeAlterForm");
    };

    return {
      possibleRelations,
      relationsPart1,
      relationsPart2,
      editAlterFinished,
    };
  },
});
</script>

<style scoped lang="scss">
div.form {
  margin-top: 0.5em;
}
</style>
