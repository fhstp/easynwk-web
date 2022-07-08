<template>
  <div id="nav">
    <!-- <router-link to="/">Home</router-link> -->
    <!-- <router-link to="/about">About</router-link> -->
  </div>
  <router-view />
</template>
<script>
export default {
  created() {
    document.documentElement.setAttribute('lang', 'de')
  }
}
</script>
<style></style>
