<template>
  <div class="form">
    <div
      class="field has-text-danger"
      v-if="alter.distance == 0 || alter.angle == 0"
    >
      <span class="icon is-small">
        <font-awesome-icon icon="exclamation-triangle" />
      </span>
      Die Position in der Karte muss noch festgelegt werden.
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Name</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
              :class="{ 'is-danger': alter.name === '' }"
              v-model="alter.name"
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
        <label class="label">Rolle</label>
      </div>
      <div class="field-body">
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model="alter.role">
              <option v-for="value in roleOptions" :key="value">{{
                value
              }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal"></div>
      <div class="field-body">
        <label class="checkbox">
          <input type="checkbox" v-model="alter.contactOfPartner" />
          Kontakt der Partnerin/des Partners
        </label>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Geschlecht</label>
      </div>
      <div class="field-body">
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model="alter.currentGender">
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
            <input class="input" v-model="alter.age" type="text" />
          </div>
        </div>
      </div>
    </div>

    <div class="field">
      <div class="control">
        <textarea
          class="textarea is-small"
          v-model="alter.note"
          placeholder="Notizen zum Kontakt"
        ></textarea>
      </div>
    </div>

    <div class="field is-grouped is-grouped-centered">
      <!-- <p class="control">
          <a class="button is-primary">
            Speichern
          </a>
        </p> -->
      <p class="control">
        <button
          class="button is-light"
          v-on:click.stop="$emit('edit-finished')"
        >
          Fertig
        </button>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Alter } from "@/data/Alter";
import { Gender } from "@/data/Gender.ts";
import { Roles } from "@/data/Roles";

@Component
export default class AlteriEditForm extends Vue {
  @Prop(Object) private alter!: Alter;
  private genderOptions = Gender;
  private roleOptions = Roles;

  constructor() {
    super();
  }
}
</script>

<style scoped lang="scss">
div.form {
  margin-top: 0.5em;
}
</style>