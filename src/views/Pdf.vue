<template>
  <div id="printinfo" class="buttons">
    <button class="button" @click="createPdf">
      <span class="icon">
        <font-awesome-icon icon="file-pdf" />
      </span>
      <span>Drucken bzw. als PDF drucken</span>
    </button>

    <button class="button" onclick="window.close()">
      <span class="icon">
        <font-awesome-icon icon="arrow-left" />
      </span>
      <span>Schließen & zur easyNWK zurückkehren</span>
    </button>
  </div>

  <div id="print">
    <div id="titlebar">
      <div id="brand"><i>easy</i>NWK</div>
    </div>
    <div id="egobar">
      <EgoHeader />
    </div>
    <div class="columns">
      <div class="column">
        <p class="panel-heading">Kontakte</p>
        <div
          v-for="(alter, index) in alteri"
          v-bind:key="index"
          class="panel-block"
        >
          <p class="name">{{ alter.name }}</p>
          <p>{{ alter.role }}</p>
          <p>{{ alter.age.length >= 1 ? "Alter: " + alter.age : "" }}</p>
          <p>{{ alter.human ? "" : "Mensch: Nein" }}</p>
          <p>Geschlecht: {{ alter.currentGender }}</p>
          <p>{{ alter.deceased ? "Verstorben: Ja" : "" }}</p>
          <p>
            Beziehung:
            {{
              alter.edgeType == 1
                ? "besteht"
                : alter.edgeType == 2
                ? "multiplex"
                : "keine aktuelle Beziehung"
            }}
          </p>
          <p>{{ alter.note.length >= 1 ? "Notiz: " + alter.note : "" }}</p>
        </div>
      </div>
    </div>
    <NetworkMap />
  </div>
</template>
<script lang="ts">
import EgoHeader from "@/components/EgoHeader.vue";
import NetworkMap from "@/components/NetworkMap.vue";
//import "@/components/ViewOptionsPanel";
import { useStore } from "@/store";
import { computed } from "vue";

export default {
  name: "Pdf",
  components: {
    EgoHeader,
    NetworkMap,
  },
  setup() {
    const store = useStore();

    // knows list of Alter from vuex
    const alteri = computed(() => store.state.nwk.alteri);

    return {
      alteri,
    };
  },
  methods: {
    createPdf,
  },
  mounted() {
    createPdf();
  },
};

export function createPdf() {
  window.print();
}
</script>

<style scoped>
.connection {
  padding: 3px 0;
}
.name {
  font-weight: bold;
}
.panel-block {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
#brand {
  margin: 0 0.5em;
  font-weight: bold;
}
#egobar {
  font-size: 1rem;
  background: #ffc37d;
  padding: 0.5rem 1vmin 1vmin 1vmin;
  margin: 0 1px 1rem 1px;
  border-radius: 0 0 6px 6px;
}

#titlebar {
  font-size: 180%;
  background: #005096;
  color: white;
  padding: 1vmin 1vmin 0.3rem 1vmin;
  margin: 0.5rem 1px 0 1px;
  border-radius: 6px 6px 0 0;
  flex-shrink: 0;

  flex-direction: row;
  flex-wrap: nowrap;
  display: flex;
}
@media print {
  #printinfo {
    display: none;
  }

  /*To Do: Schwarz-Weiß*/
  #titlebar {
    background: #005096 !important;
    -webkit-print-color-adjust: exact;
  }
  #egobar {
    background: #ffc37d !important;
    -webkit-print-color-adjust: exact;
  }
  .panel-heading {
    background: #dbdbdb !important;
    -webkit-print-color-adjust: exact;
  }
}
</style>
