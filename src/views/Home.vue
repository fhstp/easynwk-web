<template>
  <div class="home">
    <Form />
    <MapParent />
  </div>
</template>

<script>
// @ is an alias to /src
import Form from "@/components/Form.vue";
import MapParent from "@/components/MapParent.vue";

export default {
  name: "Home",
  components: {
    Form,
    MapParent
  }
};
</script>
