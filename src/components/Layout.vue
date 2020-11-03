<template>
  <el-container>
    <el-header class="header">
      <el-menu
        :default-active="active"
        background-color="#2c3e50"
        text-color="#fff"
        active-text-color="rgb(255, 186, 56)"
        :router="true"
        class="header-menu"
        mode="horizontal"
      >
        <el-menu-item class="logo-menu-item"
          ><el-icon class="icon" name="hot-water"></el-icon> Cafe
          Portal</el-menu-item
        >

        <el-menu-item
          index="/login"
          v-if="!userInfo"
          class="pull-right-menu-item"
          >Login</el-menu-item
        >
        <el-submenu index="user" v-if="!!userInfo" class="pull-right-menu-item">
          <template slot="title">{{ userInfo.userName }}</template>
          <el-menu-item index="change_password" @click="handleChangePassword"
            >change password</el-menu-item
          >
          <el-menu-item index="logout" @click="handleLogout"
            >logout</el-menu-item
          >
        </el-submenu>

        <el-menu-item
          index="/tasks"
          v-if="!!userInfo"
          class="pull-right-menu-item"
          >My Tasks</el-menu-item
        >
        <el-menu-item index="/search" class="pull-right-menu-item"
          >Search</el-menu-item
        >
        <el-menu-item index="/" class="pull-right-menu-item"
          >Index</el-menu-item
        >
      </el-menu>
    </el-header>
    <el-container class="container">
      <slot></slot>
    </el-container>
  </el-container>
</template>

<script>
import { userContext } from '../contexts'
import { cafeClient } from '../clients'

export default {
  name: 'Layout',
  mounted() {
    userContext.$on('change:userInfo', userInfo => {
      console.log(userInfo)
      this.userInfo = userInfo
    })
    this.userInfo = userContext.userInfo
    this.$router.afterEach(to => {
      this.active = to.path
    })
  },
  data() {
    return {
      active: this.$route.path,
      userInfo: userContext.userInfo,
    }
  },
  methods: {
    handleChangePassword() {},
    handleLogout() {
      cafeClient.logout().then(() => {
        userContext.setUserInfo(null)
        this.$message.success('logout success!')
        this.$router.replace({ path: '/' })
      })
    },
  },
}
</script>

<style scoped>
.pull-right-menu-item {
  float: right;
}
.logo-menu-item {
  font-weight: bolder;
  margin-right: 20px;
  color: #fff;
}
.icon {
  color: #ffba38;
  font-size: 20px;
  margin-right: 5px;
}
.header {
  padding: 0;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 100;
}
.container {
  background: #f5f5f5;
  min-height: 100vh;
  padding-top: 60px;
}
</style>
