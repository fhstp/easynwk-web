<template>
  <div class="panel">
    <p class="panel-heading" @click.stop="isOpen = !isOpen">
      <span>Soziale Unterstützung</span>
      <span class="icon is-medium clickAble right">
        <font-awesome-icon v-if="isOpen" icon="chevron-up" />
        <font-awesome-icon v-else icon="chevron-down" size="1x" />
      </span>
    </p>
    <div class="panel-block form">
      <div class="field is-horizontal">
        <div class="field-body">
          <div id="view-settings" class="field" v-if="isOpen">
            <div class="control">
              <div class="box">
                <font-awesome-icon icon="heart" />
                Emotional:
              </div>
              <div class="box">
                <font-awesome-icon icon="brain" />
                Kognitiv:
              </div>
              <div class="box">
                <font-awesome-icon icon="comments" />
                Sozial:
              </div>
              <div class="box">
                <font-awesome-icon icon="money-bill-wave" />
                Materiell:
              </div>
              <div class="box">
                <font-awesome-icon icon="hard-hat" />
                Praktisch:
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "@/store";
import de from "@/de";
import en from "@/en";

export default defineComponent({
  mixins: [de, en],
  methods: {
    t(prop: string) {
      return this[document.documentElement.lang][prop];
    },
  },
  setup() {
    const store = useStore();

    const isOpen = ref(false);

    return {
      isOpen: isOpen,
    };
  },
});
</script>

<style lang="scss">
.right {
  float: right;
}
</style>
