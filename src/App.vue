<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> -->
      <!-- <router-link to="/about">About</router-link> -->
    </div>
    <div class="field">
      <p class="control has-icons-left">
        <input class="input" type="email" placeholder="Email" />
        <span class="icon is-small is-left">
          <font-awesome-icon
            icon="exchange-alt"
            data-fa-transform="rotate-90"
          />
        </span>
      </p>
    </div>
    <router-view />
  </div>
</template>

<style></style>
