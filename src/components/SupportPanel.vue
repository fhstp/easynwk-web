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
                  :style="{ color: heartClicked ? 'orange' : '#afafaf' }"
                  class="clickAble"
                  @click="toggleHeartIcon"
                  @click.stop="toggleEmotional"
                />
                Emotional: {{ alteriEmotional }}
              </div>
              <div class="box">
                <font-awesome-icon
                  icon="brain"
                  :style="{ color: brainClicked ? 'orange' : '#afafaf' }"
                  class="clickAble"
                  @click="toggleBrainIcon"
                  @click.stop="toggleCognitive"
                />
                Kognitiv: {{ alteriCognitive }}
              </div>
              <div class="box">
                <font-awesome-icon
                  icon="comments"
                  :style="{ color: speakClicked ? 'orange' : '#afafaf' }"
                  class="clickAble"
                  @click="toggleSpeakIcon"
                  @click.stop="toggleSocial"
                />
                Sozial: {{ alteriSocial }}
              </div>
              <div class="box">
                <font-awesome-icon
                  icon="money-bill-wave"
                  :style="{ color: moneyClicked ? 'orange' : '#afafaf' }"
                  class="clickAble"
                  @click="toggleMoneyIcon"
                  @click.stop="toggleMaterial"
                />
                Materiell: {{ alteriMaterial }}
              </div>
              <div class="box">
                <font-awesome-icon
                  icon="hard-hat"
                  :style="{ color: helmetClicked ? 'orange' : '#afafaf' }"
                  class="clickAble"
                  @click="toggleHelmetIcon"
                  @click.stop="togglePractical"
                />
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
  },
  setup() {
    const store = useStore();

    const isOpen = ref(false);
    const heartClicked = ref(false);
    const speakClicked = ref(false);
    const moneyClicked = ref(false);
    const helmetClicked = ref(false);
    const brainClicked = ref(false);

    const toggleHeartIcon = () => {
      heartClicked.value = !heartClicked.value;
    };
    const toggleBrainIcon = () => {
      brainClicked.value = !brainClicked.value;
    };
    const toggleSpeakIcon = () => {
      speakClicked.value = !speakClicked.value;
    };
    const toggleMoneyIcon = () => {
      moneyClicked.value = !moneyClicked.value;
    };
    const toggleHelmetIcon = () => {
      helmetClicked.value = !helmetClicked.value;
    };

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
      brainClicked: brainClicked,
      moneyClicked: moneyClicked,
      speakClicked: speakClicked,
      helmetClicked: helmetClicked,
      toggleHeartIcon,
      toggleBrainIcon,
      toggleSpeakIcon,
      toggleMoneyIcon,
      toggleHelmetIcon,
      alteri: alteri,
      alteriEmotional: alteriEmotional,
      alteriCognitive: alteriCognitive,
      alteriSocial: alteriSocial,
      alteriMaterial: alteriMaterial,
      alteriPractical: alteriPractical,
      toggleEmotional: () => store.commit("view/toggle", "emotional"),
      toggleCognitive: () => store.commit("view/toggle", "cognitive"),
      toggleSocial: () => store.commit("view/toggle", "social"),
      toggleMaterial: () => store.commit("view/toggle", "material"),
      togglePractical: () => store.commit("view/toggle", "practical"),
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
