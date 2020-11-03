const { cafeAPIClient } = require('../clients')
const { responseModel } = require('../core')
const { UserTask } = require('../model')
const _ = require('lodash')
module.exports = {
  createTask(req, res) {
    const { body } = req
    const { userId } = req.session
    const nclScript = _.omit(body.nclScript, ['taskName'])
    const models = body.models

    cafeAPIClient
      .createTask({ nclScript, models })
      .then(taskId =>
        UserTask.create({
          userId,
          taskId,
          taskName: body.nclScript.taskName,
          params: JSON.stringify(nclScript),
          nclName: nclScript.name,
          createTime: Math.round(new Date().getTime() / 1000),
          updateTime: Math.round(new Date().getTime() / 1000),
        }),
      )
      .then(userTask => {
        res.json(responseModel.ResponseSuccess.create(userTask.toJSON()))
      })
      .catch(e => {
        logger.error(`create task error: ${e.message}`)
        res.json(responseModel.InternalError.fromError(e).toJSON())
      })
  },

  getTaskDetail(req, res) {
    const { userId } = req.session
    const { taskId } = req.params
    UserTask.findOne({
      where: {
        userId,
        taskId,
      },
    }).then(task => {
      return cafeAPIClient
        .getTaskDetail(task.taskId)
        .then(data => {
          res.json(
            responseModel.ResponseSuccess.create({
              ...task.toJSON(),
              ...data[0],
            }).toJSON(),
          )
        })
        .catch(e => {
          res.json(responseModel.InternalError.fromError(e).toJSON())
        })
    })
  },

  getUserTasks(req, res) {
    const { userId } = req.session
    const { limit = 10, offset = 0 } = req.query
    UserTask.findAndCountAll({
      where: {
        userId: userId,
      },
      limit: Number(limit),
      offset: Number(offset),
    })
      .then(data => {
        const taskIds = data.rows.map(item => item.taskId)
        return Promise.all(
          taskIds.map(id => cafeAPIClient.getTaskDetail(id)),
        ).then(contents => {
          const rows = data.rows.map((item, index) => {
            let content = contents[index]
            if (content) {
              content = content[0]
            } else {
              content = {}
            }
            return {
              ...item.toJSON(),
              ...content,
            }
          })
          res.json(
            responseModel.ResponseSuccess.create({
              list: rows,
              total: data.count,
            }).toJSON(),
          )
        })
      })
      .catch(e => {
        res.json(responseModel.InternalError.fromError(e))
      })
  },
}
