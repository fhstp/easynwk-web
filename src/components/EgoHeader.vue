<template>
  <div id="ego">
    {{ translate("anchorMsg") }}:&nbsp;
    <b>{{ displayName }}</b>
    &nbsp;
    <span v-if="egoAge">/ {{ egoAge }} </span>
    &nbsp;
    <button
      class="button is-small"
      :title="translate('anchorMsg2')"
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
import de from "@/de";
import en from "@/en";
// import { Ego } from "@/data/Ego";

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
