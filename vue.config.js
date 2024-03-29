/* eslint-disable @typescript-eslint/no-var-requires */
process.env.VUE_APP_VERSION = require("./package.json").version;

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/variables.scss";`,
        // prependData: `@import "@/assets/variables.scss";`,
      },
    },
  },
  pages: {
    index: {
      // entry for the page
      entry: "src/main.ts",
      title: "easyNWK",
    },
  },
  publicPath: "./",
  transpileDependencies: true,
});
