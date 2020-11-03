import BaseClient from './BaseClient'

export default class CafeClient extends BaseClient {
  constructor() {
    super()
  }
  signup(form) {
    return this.post('/user/signup', form)
  }

  login(form) {
    return this.post('/user/login', form)
  }

  logout() {
    return this.post('/user/logout')
  }

  changePassword(form) {
    return this.put('/user/password', form)
  }

  changeProfile(form) {
    return this.put('/user', form)
  }

  getTaskList(options) {
    return this.get('/user/tasks', options)
  }

  getTaskDetail(taskId) {
    return this.get(`/user/tasks/${taskId}`)
  }

  queryModels(options) {
    return this.get('/model/filter', options)
  }

  fetchFilterOptions() {
    return this.get('/model/filter/options')
  }

  getUserInfo() {
    return this.get('/user')
  }

  createTask(taskForm) {
    return this.post('/user/tasks', taskForm)
  }

  getCaptcha() {
    return this.get('/captcha', { r: new Date().getTime(), height: 40 })
  }
}
