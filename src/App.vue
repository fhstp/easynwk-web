<template>
  <!-- <div id="nav">
     <router-link to="/">Home</router-link>
     <router-link to="/about">About</router-link>
  </div> -->
  <router-view />
</template>
<script lang="ts">
export default {
  created(): void {
    document.documentElement.setAttribute("lang", "de");
  },
};
</script>
<style></style>
