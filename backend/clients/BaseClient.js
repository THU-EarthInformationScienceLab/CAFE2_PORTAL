const axios = require('axios')
const humps = require('humps')
const qs = require('querystring')
const { isArray, isObject } = require('lodash')

const DEFAULT_OPTIONS = {
  underscoreRequestData: true,
  camelizeResponseData: true,
  dataType: 'json', // json ||
}

class BaseClient {
  /**
   * @param {String} [apiURLPrefix]
   * @param {Object} [options]
   */
  constructor(apiURLPrefix = '', options = {}) {
    this.apiURLPrefix = apiURLPrefix
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    }
  }

  /**
   * request by GET
   * @param url [string] relative url
   * @param data [object] query data
   * @param options [object] request options
   * @returns {*}
   */
  get(url, data, options) {
    return this._request(url, 'get', data, options)
  }

  /**
   * request by POST
   * @param url [string] relative url
   * @param data [object] request body
   * @param options [object] request options
   * @returns {*}
   */
  post(url, data, options) {
    return this._request(url, 'post', data, options)
  }

  /**
   * request by PUT
   * @param url [string] relative url
   * @param data [object] request body
   * @param options [object] request options
   * @returns {*}
   */
  put(url, data, options) {
    return this._request(url, 'put', data, options)
  }

  /**
   * request by DELETE
   * @param url [string] relative url
   * @param data [object] query data
   * @param options [object] request options
   * @returns {*}
   */
  delete(url, data, options) {
    return this._request(url, 'delete', data, options)
  }

  createRequestConfig(method, url, params, data, options) {
    const { underscoreRequestData } = this.options

    // 将驼峰转换成下划线格式
    if (underscoreRequestData) {
      params = humps.decamelizeKeys(params || {})
      data = humps.decamelizeKeys(data || {})
    }
    const config = {
      method,
      url,
      params,
      data,
      ...options,
    }
    return config
  }

  //   删除空值
  removeEmptyValue(data, options) {
    const {
      removeEmptyValue = true,
      defaultRemoveTypeArray = [null, undefined, NaN],
    } = options
    let rmTypeArray = []
    if (removeEmptyValue) {
      rmTypeArray = ['', ...defaultRemoveTypeArray]
    } else {
      rmTypeArray = defaultRemoveTypeArray
    }
    if (isArray(data)) {
      // eslint-disable-next-line no-param-reassign
      data = data.reduce((r, val) => {
        if (!rmTypeArray.includes(val)) {
          // eslint-disable-next-line no-param-reassign
          r.push(val)
        }
        return r
      }, [])
    } else if (isObject(data)) {
      // eslint-disable-next-line no-param-reassign
      data = Object.keys(data).reduce((r, key) => {
        const val = data[key]
        if (!rmTypeArray.includes(val)) {
          // eslint-disable-next-line no-param-reassign
          r[key] = val
        }
        return r
      }, {})
    }
    return data
  }

  _request(url, method = 'get', data = {}, options = {}) {
    // eslint-disable-next-line no-param-reassign
    method = method.toUpperCase()
    let query = {}
    let body = {}

    // eslint-disable-next-line default-case
    switch (method) {
      case 'GET':
      case 'DELETE':
        query = data
        break
      case 'PUT':
      case 'POST':
        body = data
        break
    }
    const apiURLPrefix = options.apiURLPrefix || this.apiURLPrefix
    const config = this.createRequestConfig(
      method,
      `${apiURLPrefix}${url}`,
      query,
      body,
      options,
    )
    config.params = this.removeEmptyValue(config.params, options)
    config.data = this.removeEmptyValue(config.data, options)
    const dataType = options.dataType || this.options.dataType
    if (dataType === 'json') {
      config.headers = {
        ...(config.headers || {}),
        'Content-Type': 'application/json',
      }
    }
    if (dataType === 'form') {
      config.headers = {
        ...(config.headers || {}),
        'Content-Type': 'application/x-www-form-urlencoded',
      }
      config.data = qs.stringify(config.data)
    }
    if (dataType === 'multipart') {
      config.headers = {
        ...(config.headers || {}),
        'Content-Type': 'multipart/form-data',
      }
    }
    if (
      config.data &&
      isObject(config.data) &&
      !Object.keys(config.data).length
    ) {
      delete config.data
    }
    logger.info(`CLIENT REQUEST [${config.method}:${config.url}]
      PARAMS: ${JSON.stringify(config.params || {})}
      DATA: ${JSON.stringify(config.data)}
    `)
    return axios(config)
      .catch(this._handleFail.bind(this))
      .then(resp => this._handleSuccess([resp, config]))
  }

  _handleSuccess([resp, config]) {
    const { data } = resp
    const { camelizeResponseData } = this.options
    if (camelizeResponseData && data.data) {
      // 下划线转驼峰
      data.data = humps.camelizeKeys(data.data)
    }
    if (!data.success) {
      const error = new Error(data.errorMsg || '未知错误')
      error.code = 'internal_error'
      error.config = config
      error.responsed = true
      logger.error(`SERVER RESPONSE ERROR => 
    ${JSON.stringify(error, null, 2)}`)
      throw error
    }
    logger.info(
      `SERVER RESPONSE SUCCESS => ${JSON.stringify(data.data).substr(
        0,
        1000,
      )}...`,
    )
    return data.data
  }

  _handleFail(error) {
    const { response, request, config } = error
    let message = '内部错误，请稍候再试！',
      code = 'internal_error'
    let err
    if (response) {
      const { data } = response
      if (!data) {
        message = '网络请求失败，请稍后重试'
        code = 'network_error'
      } else {
        const { result_code, display_msg, message: msg } = data
        message = display_msg || msg || '内部错误，请稍候再试！'
        code = result_code
      }
      err = new Error(message)
      err.result_code = code
      err.code = code
      err.responsed = true
    }
    if (request) {
      message = '网络请求失败，请稍后重试'
      code = 'network_error'
      err = new Error(message)
      err.result_code = code
      err.code = code
      err.responsed = false
    }
    if (!err) {
      err = error
    } else {
      err.config = config
    }
    logger.error(`REQUEST ERROR => 
    ${JSON.stringify(err, null, 2)}`)
    throw err
  }
}

module.exports = BaseClient
