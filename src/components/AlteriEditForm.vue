<template>
  <div class="form">
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Name</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <input
              class="input"
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
          <!-- TODO bind alteri roles -->
          <div class="select is-fullwidth">
            <select>
              <option>Mutter</option>
              <option>Vater</option>
              <option>FreundIn</option>
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
      <p class="control" v-on:click.stop="$emit('cancel')">
        <a class="button is-light">
          Fertig
        </a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Alter } from "@/data/Alter";
import { Gender } from "@/data/Gender.ts";

@Component
export default class AlteriEditForm extends Vue {
  @Prop(Alter) private alter!: Alter;
  private genderOptions = Gender;

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
