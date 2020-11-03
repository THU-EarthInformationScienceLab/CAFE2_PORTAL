const express = require('express')
const humps = require('humps')
const { responseModel } = require('./core')

const {
  userControllers,
  searchControllers,
  taskControllers,
} = require('./controllers')

const router = express.Router()

router.use((req, res, next) => {
  try {
    if (req.body) {
      req.body = humps.camelizeKeys(req.body)
    }
    if (req.query) {
      req.query = humps.camelizeKeys(req.query)
    }
    next()
  } catch (e) {
    return res.json(responseModel.InternalError.fromError(e).toJSON())
  }
})

router
  .post(
    '/user/login',
    userControllers.checkCaptchaMiddleWare,
    userControllers.login,
  )
  .post(
    '/user/signup',
    userControllers.checkCaptchaMiddleWare,
    userControllers.signUp,
  )
  .post(
    '/user/logout',
    userControllers.checkLoginMiddleware,
    userControllers.logout,
  )
  .put(
    '/user',
    userControllers.checkLoginMiddleware,
    userControllers.updateProfile,
  )
  .put(
    '/user/password',
    userControllers.checkLoginMiddleware,
    userControllers.changePassword,
  )
  .get(
    '/user',
    userControllers.checkLoginMiddleware,
    userControllers.getUserProfile,
  )
  .get('/captcha', userControllers.getCaptcha)

router
  .get('/model/filter/options', searchControllers.fetchFilterOptions)
  .get('/model/filter', searchControllers.filterModels)

router
  .post(
    '/user/tasks',
    userControllers.checkLoginMiddleware,
    taskControllers.createTask,
  )
  .get(
    '/user/tasks',
    userControllers.checkLoginMiddleware,
    taskControllers.getUserTasks,
  )
  .get(
    '/user/tasks/:taskId',
    userControllers.checkLoginMiddleware,
    taskControllers.getTaskDetail,
  )

module.exports = router
