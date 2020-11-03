const { User } = require('../model')
const svgCaptcha = require('svg-captcha')
const { responseModel } = require('../core')
const utils = require('../utils')

const CAPTCHA_EXPIRE_TIME = 5 * 60 * 1000

const userController = {
  _verifyPassword(req) {
    const { userName, password } = req.body
    return User.findOne({ where: { username: userName } }).then(user => {
      if (!user) {
        return null
      }
      const userPass = user.password
      const verifyPass = utils.cryptPassword(password, user.salt).passwordHash
      if (userPass === verifyPass) {
        return user
      } else {
        return null
      }
    })
  },
  checkCaptchaMiddleWare(req, res, next) {
    const { captcha } = req.session
    if (!captcha || !req.body || !req.body.captcha) {
      logger.error(
        `do not found captcha from request, ${JSON.stringify(req.body)}`,
      )
      return res.json(new responseModel.CaptchaNotExistError().toJSON())
    }
    const timestamp = new Date().getTime()
    const isExpire =
      Math.abs(timestamp - captcha.timestamp) > CAPTCHA_EXPIRE_TIME
    const isNotEqual =
      captcha.text.toLowerCase() !== req.body.captcha.toLowerCase()
    if (isExpire || isNotEqual) {
      logger.error(
        `user captcha check invalid! isExpire=${isExpire}; isNotEqual=${isNotEqual}`,
      )
      return res.json(new responseModel.CaptchaInvalidError().toJSON())
    }
    logger.info('user captcha check valid')
    next()
  },
  login(req, res) {
    userController
      ._verifyPassword(req)
      .then(user => {
        if (!user) {
          return res.json(
            new responseModel.UserNotExistOrPasswordError().toJSON(),
          )
        }
        user.loginTime = utils.getNowUnixTimestamp()
        return userController._saveUser(user, req).then(user => {
          res.json(responseModel.ResponseSuccess.create(user).toJSON())
        })
      })
      .catch(e => {
        res.json(responseModel.InternalError.fromError(e).toJSON())
      })
  },
  logout(req, res) {
    req.session.destroy()
    res.json(responseModel.ResponseSuccess.create({ success: true }).toJSON())
  },
  checkLoginMiddleware(req, res, next) {
    if (req.session && req.session.userId) {
      return next()
    }
    return res.json(new responseModel.NeedLoginError().toJSON())
  },
  signUp(req, res) {
    const { userName, password, email } = req.body
    User.findOne({
      where: {
        username: userName,
      },
    })
      .then(user => {
        if (user) {
          return res.json(new responseModel.RegisterUserExistsError().toJSON())
        }
        const salt = utils.genRandomSalt(10)
        return User.create({
          userName,
          salt,
          password: utils.cryptPassword(password, salt).passwordHash,
          regTime: utils.getNowUnixTimestamp(),
          loginTime: utils.getNowUnixTimestamp(),
          email,
        })
      })
      .then(user => {
        return userController._saveUser(user, req)
      })
      .then(user => {
        res.json(responseModel.ResponseSuccess.create(user).toJSON())
      })
      .catch(e => {
        res.json(responseModel.InternalError.fromError(e).toJSON())
      })
  },
  changePassword(req, res) {
    userController
      ._verifyPassword(req)
      .then(user => {
        const { newPassword } = req.body
        if (user) {
          user.salt = utils.genRandomSalt(10)
          user.password = utils.cryptPassword(
            newPassword,
            user.salt,
          ).passwordHash
          return userController._saveUser(user, req).then(() => {
            res.json(
              responseModel.ResponseSuccess.create({ success: true }).toJSON(),
            )
          })
        } else {
          return res.json(
            new responseModel.UserNotExistOrPasswordError().toJSON(),
          )
        }
      })
      .catch(e => {
        res.json(responseModel.InternalError.fromError(e).toJSON())
      })
  },
  getUserProfile(req, res) {
    const { userId } = req.session
    User.findOne({ where: { id: userId } })
      .then(user => {
        if (!user) {
          return res.json(
            new responseModel.InternalError(
              `can not found user with user_id = ${userId}`,
            ).toJSON(),
          )
        }
        const userInfo = {
          ...user.toJSON(),
          password: undefined,
          salt: undefined,
          status: undefined,
        }
        res.json(responseModel.ResponseSuccess.create(userInfo).toJSON())
      })
      .catch(e => {
        res.json(responseModel.InternalError.fromError(e).toJSON())
      })
  },
  updateProfile(req, res) {
    const { userId } = req.session
    User.findOne({ where: { id: userId } })
      .then(user => {
        if (!user) {
          return res.json(
            new responseModel.InternalError(
              `can not found user with user_id = ${userId}`,
            ).toJSON(),
          )
        }
        const body = utils.omit(req.body, [
          'id',
          'password',
          'salt',
          'status',
          'regtime',
          'logintime',
        ])
        Object.keys(body).forEach(key => {
          user[key] = body[key]
        })
        return user.save()
      })
      .then(() => {
        return res.json(
          responseModel.ResponseSuccess.create({ success: true }).toJSON(),
        )
      })
      .catch(e => {
        res.json(responseModel.InternalError.fromError(e).toJSON())
      })
  },
  getCaptcha(req, res) {
    const { height = 40 } = req.query
    const captcha = svgCaptcha.create({ height })
    req.session.captcha = {
      text: captcha.text,
      timestamp: new Date().getTime(),
    }
    logger.info(`create captcha => ${captcha.text}`)
    res
      .status(200)
      .json(responseModel.ResponseSuccess.create(captcha.data).toJSON())
  },
  _saveUser(user, req) {
    return user.save().then(() => {
      const userInfo = {
        ...user.toJSON(),
        password: undefined,
        salt: undefined,
        status: undefined,
      }
      req.session.user = userInfo
      req.session.userId = userInfo.id
      return userInfo
    })
  },
}

module.exports = userController
