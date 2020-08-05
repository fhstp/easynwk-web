<template>
  <div class="home">
    <Form v-bind:key="formKey" />
    <MapParent v-on:reloadForm="reloadForm" />
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Form from "@/components/Form.vue";
import MapParent from "@/components/MapParent.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

Vue.component("Form", Form);
Vue.component("MapParent", MapParent);

@Component
export default class Home extends Vue {
  private formKey!: number;

  constructor() {
    super();
    this.formKey = 0;
  }

  reloadForm() {
    this.formKey++;
  }
}
</script>
