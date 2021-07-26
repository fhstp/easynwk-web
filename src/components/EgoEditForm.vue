<template>
  <nav class="panel">
    <p class="panel-heading">
      <span>Ankerperson</span>
    </p>
    <form class="panel-block form" @submit.prevent="editEgoFinished">
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Name</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input
                class="input"
                :class="{ 'is-danger': invalidName }"
                ref="egofield"
                v-model="egoName"
                type="text"
                placeholder="Wer steht im Zentrum der NWK?"
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
              <select v-model="currentGender">
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
              <input class="input" v-bind="ego.age" type="text" />
            </div>
          </div>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <textarea
            class="textarea is-small"
            v-bind="ego.note"
            placeholder="Notizen zum Kontakt"
          ></textarea>
        </div>
      </div>

      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button class="button is-primary" :disabled="invalidName">
            Fertig
          </button>
        </p>
      </div>
    </form>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
// import { Ego } from "@/data/Ego";
import { Gender } from "@/data/Gender";

export default defineComponent({
  props: {
    ego: {
      type: Object,
      required: true
    }
  },

  setup(props, {emit}) {
    // const genderOptions = Gender;
    const egoName = ref(props.ego.name);
    const currentGender = ref(props.ego.currentGender);

    const egofield = ref<InstanceType<typeof HTMLInputElement>>();

    const genderOptions = ref(Gender);

    // const genderOptions = computed(() => {
    //   return Gender;
    // });



    const invalidName = computed(() => {
      return egoName.value.trim().length === 0;
    });

    const editEgoFinished = () => {
      if (!invalidName.value) {
        console.log("would now set egoname to " + egoName.value.trim());
        // props.ego.name = egoName.value.trim();
        emit("edit-finished");
      } else {
        console.log("WHY HERE " + egoName.value + " " + invalidName.value);
        egofield.value?.focus();
        // (this.$refs.egoname as HTMLInputElement).focus();
      }
    }

    onMounted(() => {
      // the DOM element will be assigned to the ref after initial render
      egofield.value?.focus();
    })

    return {
      genderOptions,
      egoName,
      currentGender,
      egofield,
      invalidName,
      editEgoFinished
    }
  }
});
</script>

<style scoped>
.panel-block.form {
  display: block;
}
</style>
