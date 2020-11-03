const humps = require('humps')

class ResponseModel {
  constructor(content) {
    this.content = {
      response_time: new Date().getTime(),
      ...content,
    }
  }

  toJSON() {
    const content = {
      ...this.content,
    }
    return humps.decamelizeKeys(content)
  }

  static create(content) {
    return new ResponseModel(content)
  }
}

class ResponseSuccess extends ResponseModel {
  constructor(data) {
    super({ data, result_code: 'success' })
  }

  static create(data) {
    return new ResponseSuccess(data)
  }
}

class InternalError extends ResponseModel {
  constructor(message, extContent = {}) {
    super({ message, result_code: 'internal_error', ...extContent })
  }
  static fromError(error) {
    return new InternalError(error.message)
  }
}

class ParamRequireError extends ResponseModel {
  constructor(paramName, extContent = {}) {
    super({
      result_code: 'param_require',
      message: `param ${paramName} is required!`,
      require_param: paramName,
      ...extContent,
    })
  }
}

class ParamTypeError extends ResponseModel {
  constructor(paramName, extContent = {}) {
    super({
      result_code: 'type_error',
      message: `param ${paramName} has wrong type!`,
      require_param: paramName,
      ...extContent,
    })
  }
}

class LoginPasswordError extends ResponseModel {
  constructor(extContent = {}) {
    super({
      result_code: 'wrong_password',
      message: `your enter a wrong password!`,
      ...extContent,
    })
  }
}

class UserNotExistOrPasswordError extends ResponseModel {
  constructor() {
    super({
      message:
        'User password wrong, or this user does not exists! plz check again.',
      result_code: 'user_not_exist',
    })
  }
}

class NeedLoginError extends ResponseModel {
  constructor() {
    super({ message: 'Need Login First!', result_code: 'need_login' })
  }
}

class RegisterUserExistsError extends ResponseModel {
  constructor() {
    super({ message: 'This user already exists!', result_code: 'user_exists' })
  }
}

class CaptchaNotExistError extends ResponseModel {
  constructor() {
    super({ message: 'No Captcha Exist', result_code: 'no_captcha' })
  }
}
class CaptchaInvalidError extends ResponseModel {
  constructor() {
    super({
      message: 'Captcha Invalid Or Expired!',
      result_code: 'captcha_invalid',
    })
  }
}

module.exports = {
  ResponseSuccess,
  InternalError,
  ParamRequireError,
  ParamTypeError,
  LoginPasswordError,
  UserNotExistOrPasswordError,
  NeedLoginError,
  RegisterUserExistsError,
  CaptchaNotExistError,
  CaptchaInvalidError,
}
