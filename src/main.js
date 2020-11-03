import Vue from 'vue'
import ElementUi from 'element-ui'
import VueRouter from 'vue-router'
import Sticky from 'vue-sticky-directive'
import './assets/theme.scss'
import 'element-ui/lib/theme-chalk/index.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import App from './App.vue'

import Login from './pages/login'
import Tasks from './pages/tasks'
import IndexPage from './pages/index_page'
import Search from './pages/search'
import CreateTask from './pages/create_task'
import TaskDetail from './pages/task_detail'
import { cafeClient } from './clients'
import { userContext } from './contexts'
Vue.use(Sticky)
Vue.use(VueRouter)
Vue.use(ElementUi)
Vue.config.productionTip = false

Vue.prototype.user = null

const routes = [
  { path: '/login', component: Login, name: 'login' },
  { path: '/tasks', component: Tasks, name: 'tasks' },
  { path: '/tasks/:taskId', component: TaskDetail, name: 'taskDetail' },
  { path: '/', component: IndexPage, name: 'index' },
  { path: '/search', component: Search, name: 'search' },
  { path: '/tasks/create', component: CreateTask, name: 'createTask' },
]

const router = new VueRouter({
  routes,
})

cafeClient
  .getUserInfo()
  .then(userInfo => {
    userContext.setUserInfo(userInfo)
  })
  .catch(e => {
    console.log(e.message)
  })
  .finally(() => {
    new Vue({
      router,
      render: h => h(App),
    }).$mount('#app')
  })
