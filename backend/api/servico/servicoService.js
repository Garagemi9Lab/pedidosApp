const _ = require('lodash')
const Servico = require('./servico')

Servico.methods(['get', 'post', 'put', 'delete'])
.updateOptions({new: true, runValidators: true})

Servico.after('post', sendErrorsOrNext)
.after('put', sendErrorsOrNext)

function sendErrorsOrNext (req, res, next) {
  const bundle = res.locals.bundle

  if (bundle.errors) {
    var errors = parseErrors(bundle.errors)
    res.status(500).json({errors})
  } else {
    next()
  }
}

function parseErrors(nodeRestfulErrors) {
  const errors = []
  _.forIn(nodeRestfulErrors, error => errors.push(error.message))
  return errors
}

Servico.route('count', (req, res, next) => {
  Servico.count((error, value) => {
    if(error) {
      res.status(500).json({error: [error]})
    } else {
      res.json({value})
    }
  })
})

module.exports = Servico
