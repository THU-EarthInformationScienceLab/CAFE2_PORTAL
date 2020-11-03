const _ = require('lodash')
const { cafeAPIClient } = require('../clients')
const { responseModel } = require('../core')

module.exports = {
  fetchFilterOptions(req, res) {
    cafeAPIClient
      .fetchFilterOptions()
      .then(data => {
        res.json(responseModel.ResponseSuccess.create(data).toJSON())
      })
      .catch(e => {
        res.json(responseModel.InternalError.fromError(e).toJSON())
      })
  },
  filterModels(req, res) {
    const query = req.query || {}
    const searchKeys = _.pick(query, [
      'institute',
      'model',
      'experiment',
      'frequency',
      'modelingRealm',
      'ensembleMember',
      'variableName',
    ])
    const { limit, offset } = query
    cafeAPIClient
      .queryModels(searchKeys, limit, offset)
      .then(data => {
        res.json(responseModel.ResponseSuccess.create(data).toJSON())
      })
      .catch(e => {
        res.json(responseModel.InternalError.fromError(e).toJSON())
      })
  },
}
