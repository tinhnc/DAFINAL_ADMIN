const Handlebars = require("handlebars");

Handlebars.registerHelper("contains", function (array, item, options) {
  if (array && array.includes(item)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
