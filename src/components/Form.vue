<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> -->
      <!-- <router-link to="/about">About</router-link> -->
    </div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
button {
  font-size: 36px;
  margin: 10px;
  padding: 5px;
  background-color: white;
  border: none;
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
}
li {
  display: inline-block;
  margin: 0;
  padding-left: 10px;
  background-color: white;
  width: 98%;
  text-align: left;
  margin-bottom: 5px;
}

a {
  color: #42b983;
}
input,
textarea {
  height: 25px;
  width: 280px;
  margin: 0 auto;
  vertical-align: middle;
  border: none;
  font-size: 18px;
  font-family: Arial, Helvetica, sans-serif;
  padding: 2px;
  margin-right: 10px;
}
textarea {
  min-width: 85%;
  max-width: 85%;
  min-height: 25px;
  max-height: 210px;
}

p {
  font-size: 18px;
  text-align: center;
  background-color: #c4c4c4;
}

h1 {
  margin: 0 auto;
  font-size: 36px;
}
.note {
  height: 50px;
  width: 85%;
}
.inlineElement {
  display: inline-block;
}
.inputOrDropdownRight {
  float: right;
}
.iconLeft {
  float: left;
  margin-left: 15px;
}
.textLeft {
  float: left;
  margin-left: 15px;
}
.textRight {
  float: right;
}
.iconRight {
  float: right;
  padding: 10px;
}
</style>
