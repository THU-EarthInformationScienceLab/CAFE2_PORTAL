const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)
const initDb = require('./db_init')
const { init: modelInit } = require('./model')
const { getLoggerInstance } = require('./logger_init')

module.exports = (config, env, instance) => {
  if (!instance) {
    instance = express()
  }
  global._config = config
  config.env = env
  global.logger = getLoggerInstance({ logDir: config.logDir })
  instance.disable('x-powered-by')
  instance.enable('trust proxy')
  instance.use(compression())
  instance.use(
    bodyParser.urlencoded({
      limit: '5mb',
      extended: true,
    }),
  )
  instance.use(
    bodyParser.json({
      limit: '5mb',
    }),
  )
  instance.use(cookieParser())
  const sessionMiddleware = session({
    name: 'cafe-portal.sid',
    secret: config.appSecret,
    resave: true,
    store: new SQLiteStore(),
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
  instance.use(sessionMiddleware)

  /*init db instance and init model*/

  const db = initDb(config.mysql, env)
  modelInit(db)
  logger.info('db and model init success!')

  instance.use(require('./routes'))

  logger.info('router init success!')

  if (config.serveDist) {
    instance.use(express.static(path.join(__dirname, '../dist')))
  }

  instance.use((req, res, next) => {
    res.send('404 not found!')
  })

  instance.use((err, req, res, next) => {
    console.log(err.message)
    logger.error(`uncaught error => ${err.message}`)
    res.json({
      result_code: err.result_code || 'internal_error',
      message: err.message,
    })
  })

  process.on('uncaughtException', err => {
    console.error('An uncaught error occurred!')
    console.error(err.message)
    console.error(err.stack)
  })

  logger.info('cafe-portal backend server init success')
  return instance
}
