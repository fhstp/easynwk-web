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
                <font-awesome-icon
                  icon="heart"
                  style="color: #afafaf"
                  class="clickAble"
                  :class="{ clicked: heartClicked }"
                  @click.stop="toggleEmotional"
                />
                Emotional: {{ alteriEmotional }}
              </div>
              <div class="box">
                <font-awesome-icon icon="brain" style="color: #afafaf" />
                Kognitiv: {{ alteriCognitive }}
              </div>
              <div class="box">
                <font-awesome-icon icon="comments" style="color: #afafaf" />
                Sozial: {{ alteriSocial }}
              </div>
              <div class="box">
                <font-awesome-icon
                  icon="money-bill-wave"
                  style="color: #afafaf"
                />
                Materiell: {{ alteriMaterial }}
              </div>
              <div class="box">
                <font-awesome-icon icon="hard-hat" style="color: #afafaf" />
                Praktisch: {{ alteriPractical }}
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
    toggleHeart() {
      this.heartClicked = !this.heartClicked;
      console.log("Clicked");
    },
    // Add toggle methods for other icons if needed
  },
  setup() {
    const store = useStore();

    const isOpen = ref(false);
    const heartClicked = ref(false); // Add ref for other icons if needed

    const alteri = computed(() => store.state.nwk.alteri);

    const alteriEmotional = computed(() => {
      const emotionalAlteri = store.state.nwk.alteri.filter(
        (alter) => alter.supportEmotional >= 1 && alter.supportEmotional <= 3
      );
      return emotionalAlteri.map((alter) => alter.name).join(", ");
    });

    const alteriMaterial = computed(() => {
      const emotionalAlteri = store.state.nwk.alteri.filter(
        (alter) => alter.supportMaterial >= 1 && alter.supportMaterial <= 3
      );
      return emotionalAlteri.map((alter) => alter.name).join(", ");
    });

    const alteriCognitive = computed(() => {
      const emotionalAlteri = store.state.nwk.alteri.filter(
        (alter) => alter.supportCognitive >= 1 && alter.supportCognitive <= 3
      );
      return emotionalAlteri.map((alter) => alter.name).join(", ");
    });

    const alteriPractical = computed(() => {
      const emotionalAlteri = store.state.nwk.alteri.filter(
        (alter) => alter.supportPractical >= 1 && alter.supportPractical <= 3
      );
      return emotionalAlteri.map((alter) => alter.name).join(", ");
    });

    const alteriSocial = computed(() => {
      const emotionalAlteri = store.state.nwk.alteri.filter(
        (alter) => alter.supportSocial >= 1 && alter.supportSocial <= 3
      );
      return emotionalAlteri.map((alter) => alter.name).join(", ");
    });

    return {
      isOpen: isOpen,
      heartClicked: heartClicked,
      alteri: alteri,
      alteriEmotional: alteriEmotional,
      alteriCognitive: alteriCognitive,
      alteriSocial: alteriSocial,
      alteriMaterial: alteriMaterial,
      alteriPractical: alteriPractical,
      toggleEmotional: () => store.commit("view/toggle", "horizons"),
    };
  },
});
</script>

<style lang="scss">
.right {
  float: right;
}

.clicked {
  color: lightsalmon; // Change to your desired color
}
</style>
