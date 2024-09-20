<template>
  <div class="panel">
    <p class="panel-heading" @click.stop="isOpen = !isOpen">
      <span>{{ t("socialsupport") }}</span>
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
              <div style="margin: 1.5em">
                <p>{{ t("introductionsentence") }}</p>
              </div>

              <div>
                <div
                  class="clickAble"
                  :style="{
                    margin: '1em',
                    fontWeight: heartClicked ? 'bold' : 'unset',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }"
                  @click="toggleHeartIcon"
                  @click.stop="toggleEmotional"
                >
                  <font-awesome-icon
                    icon="heart"
                    :style="{
                      color: heartClicked ? 'orange' : '#afafaf',
                      marginRight: '0.5em',
                    }"
                  />
                  {{ t("emotional") }}: {{ alteriEmotional }}
                </div>
              </div>

              <div>
                <div
                  class="clickAble"
                  :style="{
                    margin: '1em',
                    fontWeight: moneyClicked ? 'bold' : 'unset',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }"
                  @click="toggleMoneyIcon"
                  @click.stop="toggleMaterial"
                >
                  <font-awesome-icon
                    icon="toolbox"
                    :style="{
                      color: moneyClicked ? 'orange' : '#afafaf',
                      marginRight: '0.5em',
                    }"
                    class="clickAble"
                  />
                  {{ t("instrumental") }}: {{ alteriMaterial }}
                </div>
              </div>

              <div>
                <div
                  class="clickAble"
                  :style="{
                    margin: '1em',
                    fontWeight: brainClicked ? 'bold' : 'unset',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }"
                  @click="toggleBrainIcon"
                  @click.stop="toggleCognitive"
                >
                  <font-awesome-icon
                    icon="lightbulb"
                    :style="{
                      color: brainClicked ? 'orange' : '#afafaf',
                      marginRight: '0.5em',
                    }"
                    class="clickAble"
                  />
                  {{ t("informational") }}: {{ alteriCognitive }}
                </div>
              </div>

              <div>
                <div
                  class="clickAble"
                  :style="{
                    margin: '1em',
                    fontWeight: speakClicked ? 'bold' : 'unset',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }"
                  @click="toggleSpeakIcon"
                  @click.stop="toggleSocial"
                >
                  <font-awesome-icon
                    icon="users"
                    :style="{
                      color: speakClicked ? 'orange' : '#afafaf',
                      marginRight: '0.5em',
                    }"
                    class="clickAble"
                  />
                  {{ t("social") }}: {{ alteriSocial }}
                </div>
              </div>

              <div>
                <div
                  class="clickAble"
                  :style="{
                    margin: '1em',
                    fontWeight: helmetClicked ? 'bold' : 'unset',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }"
                  @click="toggleHelmetIcon"
                  @click.stop="togglePractical"
                >
                  <font-awesome-icon
                    icon="link"
                    :style="{
                      color: helmetClicked ? 'orange' : '#afafaf',
                      marginRight: '0.5em',
                    }"
                    class="clickAble"
                  />
                  {{ t("linking") }}: {{ alteriPractical }}
                </div>
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

type TranslationKeys = keyof typeof de;

const translations = {
  de,
  en,
};

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
      toggleEmotional: () => store.commit("session/toggle", "emotional"),
      toggleCognitive: () => store.commit("session/toggle", "cognitive"),
      toggleSocial: () => store.commit("session/toggle", "social"),
      toggleMaterial: () => store.commit("session/toggle", "material"),
      togglePractical: () => store.commit("session/toggle", "practical"),
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
