const basicInfo = require("./basicInfo");
const servers = require("./servers");
const tags = require("./tags");
const components = require("./components");

const endpoints = require("./endpoints");

module.exports = {
  ...basicInfo,
  ...servers,
  ...tags,
  ...components,
  ...endpoints,
};
