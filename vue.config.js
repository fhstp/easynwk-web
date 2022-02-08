process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // additionalData : `@import "@/assets/variables.scss";`
        prependData: `@import "@/assets/variables.scss";`,
      },
    },
  },
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
};
