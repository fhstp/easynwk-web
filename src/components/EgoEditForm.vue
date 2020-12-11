<template>
  <nav class="panel">
    <p class="panel-heading">
      <span>Ankerperson</span>
    </p>
    <div class="panel-block form">
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Name</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input
                class="input"
                :class="{ 'is-danger': validEgoName }"
                v-model="egoName"
                type="text"
                placeholder="Vorname oder Spitzname"
              />
            </div>
            <p class="help">Pflichtfeld</p>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Geschlecht</label>
        </div>
        <div class="field-body">
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="ego.currentGender">
                <option v-for="value in genderOptions" :key="value">{{
                  value
                }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Alter</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input class="input" v-model="ego.age" type="text" />
            </div>
          </div>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <textarea
            class="textarea is-small"
            v-model="ego.note"
            placeholder="Notizen zum Kontakt"
          ></textarea>
        </div>
      </div>

      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button
            class="button is-primary"
            :disabled="validEgoName"
            v-on:click.stop="editEgoFinished"
          >
            Fertig
          </button>
        </p>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Ego } from "@/data/Ego";
import { Gender } from "@/data/Gender.ts";

@Component
export default class EgoEditForm extends Vue {
  @Prop(Object) private ego!: Ego;
  private genderOptions = Gender;
  private egoName = "";

  constructor() {
    super();
  }

  data(): {
    egoName: string;
  } {
    return {
      egoName: this.ego.name
    };
  }

  get validEgoName() {
    return this.egoName.trim().length === 0;
  }

  editEgoFinished() {
    this.ego.name = this.egoName.trim();
    this.$emit("edit-finished");
  }
}
</script>

<style scoped>
.panel-block.form {
  display: block;
}
</style>
