<template>
  <div>
    <div id="alterFields">
      <h2
        id="contactListTitleHeading"
        class="inlineElement textLeft alterListFont"
      >
        Kontakte:
      </h2>

      <img
        id="addAlterIcon"
        class="iconRight"
        src="../assets/openAddAlterPage.svg"
        alt="Kontakt hinzufügen"
        @click="openAddAlterPage()"
      />
      <div id="listOfAlter">
        <ul>
          <li v-bind:key="alterN.id" v-for="alterN in alterarray">
            <div>
              <h2 class="alterListFont">{{ alterN.name }}/{{ alterN.role }}</h2>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Alter from "./Alter";
import { v4 as uuid } from "uuid";

@Component
export default class AlterList extends Vue {
  @Prop(Array) private alter!: Array<Alter>;
  @Prop(Array) private alterarray!: Array<Alter>;
  @Prop() private gender!: Array<string>;
  @Prop(Array) private roles!: Array<string>;

  @Prop(Array) private amountOfEdges!: Array<number>;

  constructor() {
    super();
    this.roles = ["Fr", "Fa", "Ko", "He"];
    this.gender = ["männlich", "weiblich", "divers"];
    this.amountOfEdges = [0, 1, 2];

    this.alter = [];
    if (localStorage.alter) {
      const bufferArray = JSON.parse(localStorage.alter);
      for (let i = 0; i < bufferArray.length; i++) {
        this.alter[i] = bufferArray[i];
      }
    }
  }

  openAddAlterPage() {
    this.$emit("openAddAlterPage");
  }
}
</script>
<style scoped>
#contactListTitleHeading {
  margin: 0px;
  padding: 10px;
  padding-left: 10px;
  padding-top: 10px;
}
.alterListFont {
  font-size: 24px;
}
#addAlterIcon {
  padding: 15px;
  padding-right: 17px;
}
</style>
