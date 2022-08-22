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
    <AlteriPanel /> <!--To Do: genaue Informationen sollen angezeigt werden -->
    <NetworkMap />
  </div>
</template>
<script>
import EgoHeader from "@/components/EgoHeader";
import AlteriPanel from "@/components/AlteriPanel";
import NetworkMap from "@/components/NetworkMap";
import "@/components/ViewOptionsPanel";

export default {
  name: "Pdf",
  components: {
    EgoHeader,
    AlteriPanel,
    NetworkMap,
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
@media print { /*To Do: Schwarz-Weiß*/
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