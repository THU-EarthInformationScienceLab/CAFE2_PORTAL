const { DataTypes, Model } = require('sequelize')

class User extends Model {}

class UserTask extends Model {}

module.exports = {
  User,
  UserTask,
  init: sequelize => {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        userName: {
          field: 'username',
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        password: {
          field: 'pwd',
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        salt: { type: DataTypes.STRING(10), allowNull: false },
        email: { type: DataTypes.STRING(120), allowNull: false },
        status: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
        regTime: {
          field: 'regtime',
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        loginTime: {
          field: 'logintime',
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'ts_frontuser',
        createdAt: false,
        updatedAt: false,
      },
    )

    UserTask.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: { field: 'user_id', type: DataTypes.INTEGER, allowNull: false },
        taskId: {
          field: 'task_id',
          type: DataTypes.STRING(64),
          allowNull: false,
        },
        createTime: {
          field: 'create_time',
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updateTime: {
          field: 'update_time',
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        taskName: {
          field: 'task_name',
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        nclName: {
          field: 'ncl_name',
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        params: { type: DataTypes.TEXT },
        status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // ?
      },
      {
        sequelize,
        modelName: 'UserTask',
        tableName: 'ts_user_task',
        createdAt: false,
        updatedAt: false,
      },
    )

    UserTask.sync()
    User.sync()
  },
}
