<template>
  <div class="page">
    <div id="printinfo">
      <div class="buttons">
        <button class="button" @click="createPdf">
          <span class="icon">
            <font-awesome-icon icon="file-pdf" />
          </span>
          <span>{{ t("printorpdf") }}</span>
        </button>

        <button class="button" onclick="window.close()">
          <span class="icon">
            <font-awesome-icon icon="arrow-left" />
          </span>
          <span>{{ t("closeandback") }}</span>
        </button>
      </div>
      <p>
        {{ t("printtext") }}
      </p>
      <p>
        {{ t("printtext2") }}
      </p>
    </div>

    <div id="print">
      <div id="titlebar">
        <div id="brand"><i>easy</i>NWK</div>
      </div>
      <div id="egobar">
        <p class="name">{{ t("ego") + ": " + ego.name }}</p>
        <span v-if="versions.length && currentVersion >= 0">
          <!-- TODO translate -->
          Gedruckte Karte: {{ visibleNWKVersion?.title || "" }}
          vom
          <!-- TODO use internationalizable date formater -->
          {{
            visibleNWKVersion?.date?.substring(8, 10) +
            "." +
            visibleNWKVersion?.date?.substring(5, 7) +
            "." +
            visibleNWKVersion?.date?.substring(0, 4)
          }}&nbsp;
        </span>
        <p>
          {{
            ego.currentGender
              ? t("genders") + ": " + getGenderTranslation(ego.currentGender)
              : ""
          }}
        </p>
        <p>{{ ego.age.length >= 1 ? t("age") + ": " + ego.age : "" }}</p>
        <p>{{ ego.note.length >= 1 ? t("note") + ": " + ego.note : "" }}</p>
      </div>
      <div class="columns">
        <div class="column">
          <p class="panel-heading">{{ t("contacts") }}</p>
          <div
            v-for="(alter, index) in alteri"
            v-bind:key="index"
            class="panel-block"
          >
            <p class="name">{{ alter.name }}</p>
            <p>{{ alter.role }}</p>
            <p>
              {{ alter.age.length >= 1 ? t("age") + ": " + alter.age : "" }}
            </p>
            <p>{{ alter.human ? "" : t("humanno") }}</p>
            <p>
              {{
                alter.human
                  ? t("genders") +
                    ": " +
                    getGenderTranslation(alter.currentGender)
                  : t("category") + ": " + alter.currentGender
              }}
            </p>
            <p>{{ alter.deceased ? t("deceasedyes") : "" }}</p>
            <p>
              {{ t("relationship") }}:
              {{
                alter.edgeType == 1
                  ? t("existing")
                  : alter.edgeType == 2
                  ? t("multiplex")
                  : t("nocurrentrelationship")
              }}
            </p>
            <p>
              {{ alter.note.length >= 1 ? t("note") + ": " + alter.note : "" }}
            </p>
          </div>
        </div>
      </div>
      <NetworkMap />
    </div>
  </div>
</template>
<script lang="ts">
import NetworkMap from "@/components/NetworkMap.vue";
import { useStore } from "@/store";
import { defineComponent, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import de from "@/de";
import en from "@/en";

export default defineComponent({
  mixins: [de, en],
  methods: {
    t(prop: string) {
      const langParam = useRouter().currentRoute.value.query.lang;

      const lang =
        typeof langParam === "string"
          ? langParam
          : document.documentElement.lang;

      document.documentElement.lang = lang;

      return this[lang][prop];
    },
    getGenderTranslation(gender: string) {
      switch (gender) {
        case "weiblich":
          return this.t("female");
        case "männlich":
          return this.t("male");
        case "divers":
          return this.t("diverse");
        case "nicht festgelegt":
          return this.t("notspecified");
        default:
          return "";
      }
    },
  },
  name: "PdfView",
  components: { NetworkMap },
  setup: function () {
    const store = useStore();
    // knows list of Alter from vuex
    const alteri = computed(() => store.state.nwk.alteri);
    const ego = computed(() => store.state.nwk.ego);

    const createPdf = () => {
      (document.title =
        store.state.nwk.ego.name +
        " " +
        visibleNWKVersion.value?.title +
        " " +
        visibleNWKVersion.value?.date?.substring(8, 10) +
        "." +
        visibleNWKVersion.value?.date?.substring(5, 7) +
        "." +
        visibleNWKVersion.value?.date?.substring(0, 4) +
        ".pdf"),
        window.print();
    };

    const currentVersion = computed(() => store.state.record.currentVersion);

    const visibleNWKVersion = computed(() =>
      store.state.record.versions.find(
        (version) => version.id === currentVersion.value
      )
    );

    // TODO currently: workaround -> schönere Lösung
    const readHttpGet = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let pseudo: any = useRouter().currentRoute.value.query.pseudo;
      pseudo = /true/i.test(pseudo);
      pseudo ? store.commit("pseudonym/toggle") : "";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let hor: any = useRouter().currentRoute.value.query.hor;
      if (/true/i.test(hor)) {
        store.commit("view/enable", "horizons");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let con: any = useRouter().currentRoute.value.query.con;
      con = /true/i.test(con);
      con ? "" : store.commit("view/toggle", "connections");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let alt: any = useRouter().currentRoute.value.query.alt;
      alt = /true/i.test(alt);
      alt ? "" : store.commit("view/toggle", "alteriNames");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let age: any = useRouter().currentRoute.value.query.age;
      age = /true/i.test(age);
      age ? store.commit("view/toggle", "ageInNwk") : "";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let role: any = useRouter().currentRoute.value.query.role;
      role = /true/i.test(role);
      role ? store.commit("view/toggle", "roleInNwk") : "";
    };

    onMounted(() => {
      // the print dialog will open immediately
      createPdf();
      readHttpGet();
    });

    return {
      alteri,
      ego,
      createPdf,
      visibleNWKVersion,
      currentVersion: currentVersion,
      versions: computed(() => store.state.record.versions),
    };
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/main.scss";

// * {
//   filter: grayscale(1) !important;
// }
.name {
  font-weight: bold;
}
.panel-block {
  display: flex;
  background: none;
  flex-direction: column;
  align-items: baseline;
}
#brand {
  margin: 0 0;
  font-weight: bold;
}
#egobar {
  font-size: 1rem;
  padding: 0.5rem 1vmin 1vmin 1vmin;
  margin: 0 1px 1rem 1px;
  border-radius: 0 0 6px 6px;
  background: none;
}

#titlebar {
  font-size: 180%;
  color: $text;
  padding: 1vmin 1vmin 0.3rem 1vmin;
  margin: 0.5rem 1px 0 1px;
  border-radius: 6px 6px 0 0;
  flex-shrink: 0;

  flex-direction: row;
  flex-wrap: nowrap;
  display: flex;
  background: none;
}
.page {
  margin-left: 4em;
  padding: 2em 0em 0em;
}

@media screen and (min-width: 133vh) {
  .page {
    display: flex;
    flex-direction: column;
    height: 100vmin;
  }
  #print {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: none;
    padding-right: 1em;
  }
}

@media print {
  #printinfo {
    display: none;
  }
}
</style>
