<template>
  <div class="login-container">
    <div class="login-panel">
      <div class="login-panel-cover">
        <img src="@/assets/images/login-cover.svg" alt="" />
      </div>
      <div class="login-panel-content">
        <div class="login-panel-inner-bg-top-left">
          <img src="@/assets/images/login-top.svg" />
        </div>
        <div class="login-panel-inner-bg-bottom-left">
          <img src="@/assets/images/login-bottom-left.svg" />
        </div>
        <div class="login-panel-inner-bg-bottom-right">
          <img src="@/assets/images/login-bottom-right.svg" />
        </div>
        <div class="login-panel-inner-content-container">
          <div class="login-content-container">
            <div class="login-content-logo">
              <img src="@/assets/images/logo.png" alt="" />
              <p class="login-content-title">Welcome to Live Meet</p>
              <p class="login-content-text">
                Interact online to keep ideas in sync
              </p>
            </div>
            <div class="login-form">
              <a-alert
                class="mb-3"
                v-if="errorMessage"
                type="error"
                :message="errorMessage"
                banner
              />
              <a-form @submit="login" :form="form">
                <a-form-item class="login-form-item">
                  <a-input
                    v-decorator="formRule.username"
                    placeholder="Enter your username"
                  />
                </a-form-item>
                <a-form-item class="login-form-item">
                  <a-input-password
                    v-decorator="formRule.password"
                    placeholder="Enter your password"
                  />
                </a-form-item>
                <a-form-item class="login-form-item">
                  <a-button type="primary" class="w-100" html-type="submit">
                    Login
                  </a-button>
                </a-form-item>
              </a-form>
              <p class="text-center">
                You don't have an account?
                <router-link :to="{ name: 'app.login' }"
                  >Signup now</router-link
                >
              </p>
            </div>
          </div>
          <span class="login-panel-inner-bottom-text"
            >A Open Source by
            <a target="_blank" class="text-dark" href="https://codezone.asia"
              >CodeZone</a
            ></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utilities from '@/utils/utilities';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      formRule: {
        username: [
          'username',
          {
            rules: [{ required: true, message: 'Please input your username' }],
          },
        ],
        password: [
          'password',
          {
            rules: [
              {
                required: true,
                message: 'Please input your password',
              },
            ],
          },
        ],
      },
      form: this.$form.createForm(this, { name: 'login' }),
      errorMessage: null,
    };
  },
  computed: {
    ...mapState('auth', {
      isLogined: (state) => state.isLogined,
    }),
  },
  methods: {
    login(e) {
      e.preventDefault();
      this.errorMessage = null;
      this.form.validateFields(async (err, values) => {
        if (err) return;
        try {
          await this.$store.dispatch('auth/login', values);
          if (this.isLogined) {
            this.$router.push({ name: 'app.index' });
          }
        } catch (e) {
          if (e.errors) {
            return utilities.showFormErrors(this.formSignupInstance, e.errors);
          }
          this.errorMessage = e.message;
        }
      });
    },
  },
};
</script>
<style scoped>
@import '../assets/styles/login.css';
</style>
