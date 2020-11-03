<template>
  <div class="sign">
    <div class="sign-form">
      <h2>{{ mode === 'login' ? 'Login' : 'Sign Up' }}</h2>
      <el-form
        :disabled="loading"
        ref="signForm"
        :rules="validateRule"
        :model="signForm"
      >
        <el-form-item label="Username" prop="userName">
          <el-input v-model="signForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="signForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item
          v-if="mode === 'signup'"
          prop="repeatPassword"
          label="Repeat Password"
        >
          <el-input
            type="password"
            v-model="signForm.repeatPassword"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="mode === 'signup'" prop="email" label="Email">
          <el-input type="email" v-model="signForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Captcha" prop="captcha">
          <div class="captcha-form-content">
            <el-input v-model="signForm.captcha" :maxlength="4"></el-input>
            <div class="captcha-code" @click="regenerateCaptcha">
              <div v-html="captchaData" class="captcha-wrapper" />
            </div>
          </div>
        </el-form-item>
        <el-form-item class="pull-right">
          <el-link type="primary" @click="changeMode">
            <template v-if="mode === 'login'">
              do not have account? signup
              <el-icon name="el-icon-right"></el-icon>
            </template>
            <template v-else>
              have account? go login <el-icon name="el-icon-right"></el-icon>
            </template>
          </el-link>
        </el-form-item>
        <div class="sign-action">
          <el-button type="primary" :loading="loading" @click="submitForm">{{
            mode === 'login' ? 'Login' : 'Sign Up'
          }}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { cafeClient } from '../clients'
import { userContext } from '../contexts'

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      mode: 'login',
      signForm: {
        captcha: '',
      },
      captchaData: '',
      validateRule: {
        userName: [
          { required: true, message: 'please enter username', trigger: 'blur' },
          {
            min: 4,
            max: 10,
            message: 'userName can only be at 4 to 10 chars',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: 'please enter password', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: 'password can only be at 6 to 15 chars',
            trigger: 'blur',
          },
        ],
        repeatPassword: [
          {
            required: true,
            message: 'please repeat your password',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 15,
            message: 'password can only be at 6 to 15 chars',
            trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            message: 'please repeat your email',
            trigger: 'blur',
          },
        ],
        captcha: [
          {
            required: true,
            message: 'please repeat captcha code',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  mounted() {
    this.regenerateCaptcha()
  },
  methods: {
    changeMode() {
      this.mode = this.mode === 'login' ? 'signup' : 'login'
      this.validateRule = { ...this.validateRule }
      this.$refs.signForm.clearValidate()
    },
    regenerateCaptcha() {
      cafeClient.getCaptcha().then(data => {
        this.captchaData = data
        this.signForm.captcha = ''
      })
    },
    submitForm() {
      if (
        this.mode === 'signup' &&
        this.signForm.password !== this.signForm.repeatPassword
      ) {
        return this.$message.error(
          'repeat password not equal your entered password! plz check again',
        )
      }
      this.$refs.signForm.validate(valid => {
        if (!valid) {
          return this.$message.error(
            'form has error, please check your sign form!',
          )
        }
        let promise
        if (this.mode === 'login') {
          promise = cafeClient.login(this.signForm)
        } else {
          promise = cafeClient.signup(this.signForm)
        }
        promise
          .then(userInfo => {
            userContext.setUserInfo(userInfo)
            this.$message.success(`${this.mode} success!`)
            this.$router.push({ path: '/' })
          })
          .catch(e => {
            this.$message.error(e.message)
            if (e.code === 'captcha_invalid') {
              this.regenerateCaptcha()
            }
          })
      })
    },
  },
}
</script>

<style scoped>
.sign {
  display: block;
  width: 100%;
}
.sign-form {
  width: 500px;
  background: #fbfbfb;
  margin: 100px auto;
  padding: 60px 40px 20px 40px;
  border: 1px solid #cecece;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}
.pull-right {
  text-align: right;
}
.sign-action {
  text-align: right;
  margin-top: 20px;
}
.captcha-form-content {
  display: flex;
  width: 100%;
}
.captcha-wrapper {
  height: 40px;
  margin-left: 20px;
}
</style>
