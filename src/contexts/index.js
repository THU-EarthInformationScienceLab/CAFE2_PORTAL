import Vue from 'vue'

export const userContext = new Vue({
  data() {
    return { userInfo: null }
  },
  methods: {
    setUserInfo(userInfo) {
      this.$emit('change:userInfo', userInfo)
      this.userInfo = userInfo
    },
    getUserInfo() {
      return this.userInfo
    },
  },
})
