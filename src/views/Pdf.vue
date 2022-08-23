<template>
  <button class="button" @click="createPdf">
    <span class="icon">
      <font-awesome-icon icon="fa-solid fa-file-pdf" />
    </span>
    <span>Create PDF</span>
  </button>

  <button class="button" @click="this.$tabs.close()">
    <span class="icon">
      <font-awesome-icon icon="fa-solid fa-square-xmark" />
    </span>
    <span>Tab schließen</span>
  </button>

  <div id="print">
    <div id="titlebar">
      <div id="brand"><i>easy</i>NWK</div>
    </div>
    <div id="egobar">
      <EgoHeader />
    </div>
      <div v-for="(alter, index) in alteri" v-bind:key="index" class="connection">
        {{ alter.name }}, {{ alter.role }}, Mensch: {{alter.human}}, {{ alter.currentGender }}, {{ alter.age }}, Verstorben: {{ alter.deceased }}, {{ alter.note }}
      </div>
    <NetworkMap />
  </div>
</template>
<script>
import EgoHeader from "@/components/EgoHeader";
import NetworkMap from "@/components/NetworkMap";
import "@/components/ViewOptionsPanel";
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
  let stylesHtml = "";
  for (const node of [
    ...document.querySelectorAll('link[rel="stylesheet"], style'),
  ]) {
    stylesHtml += node.outerHTML;
  }
  const el = document.getElementById("print");
  const w = window.open(
    "",
    "",
    "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
  );
  w.document.write(`<!DOCTYPE html>
        <html>
          <head>
            ${stylesHtml}
          </head>
          <body>
            ${el.innerHTML}
          </body>
        </html>`);
  w.document.close();
  w.focus();
  w.print();
  w.close();
}
</script>

<style scoped>
.connection{
  padding: 3px 0;

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
  /*To Do: Schwarz-Weiß*/
  #titlebar {
    background: #005096 !important;
    -webkit-print-color-adjust: exact;
  }
  #egobar {
    background: #ffc37d !important;
    -webkit-print-color-adjust: exact;
  }
}
</style>
