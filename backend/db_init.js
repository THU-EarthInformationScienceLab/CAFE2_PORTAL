const { Sequelize } = require('sequelize')

module.exports = (dbConfig, env) => {
  return new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      dialect: 'mysql',
      port: dbConfig.port || 3306,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    },
  )
}
