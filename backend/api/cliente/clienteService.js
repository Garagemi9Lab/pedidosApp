const _ = require("lodash");
const Cliente = require("./cliente");

Cliente.methods(["get", "post", "put", "delete"]).updateOptions({
  new: true,
  runValidators: true
});

Cliente.after("post", sendErrorsOrNext).after("put", sendErrorsOrNext);

function sendErrorsOrNext(req, res, next) {
  const bundle = res.locals.bundle;

  if (bundle.errors) {
    var errors = parseErrors(bundle.errors);
    res.status(500).json({ errors });
  } else {
    next();
  }
}

function parseErrors(nodeRestfulErrors) {
  const errors = [];
  _.forIn(nodeRestfulErrors, error => errors.push(error.message));
  return errors;
}

Cliente.route("count", (req, res, next) => {
  Cliente.count((error, value) => {
    if (error) {
      res.status(500).json({ error: [error] });
    } else {
      res.json({ value });
    }
  });
});

module.exports = Cliente;
