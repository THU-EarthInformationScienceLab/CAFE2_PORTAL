const BaseClient = require('./BaseClient')

class CafeAPIClient extends BaseClient {
  constructor() {
    super(global._config.endpoints.cafeWorker, { underscoreRequestData: false })
  }

  fetchFilterOptions() {
    return this.get('/api/v1/modelfile/query/filter')
  }

  queryModels(options, limit, offset) {
    const str = Object.keys(options)
      .reduce(
        (r, i) => {
          const value = options[i]
          value.forEach(item => {
            r.push(`${i}=${encodeURIComponent(item)}`)
          })
          return r
        },
        [`page=${Math.round(offset / limit)}&pageSize=${limit}`],
      )
      .join('&')
    logger.info(`query model: ${str}`)
    return this.get(`/api/v1/modelfile/query?${str}`)
  }

  createTask(form) {
    return this.post('/api/v1/task/submit', form)
  }

  getTaskDetail(taskId) {
    return this.get('/api/v1/task/query', { taskId: taskId, id: taskId })
  }
}

module.exports = CafeAPIClient
