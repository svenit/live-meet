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
          <div
            class="login-content-container position-relative"
            style="top: -60px"
          >
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
              <a-form @submit="signup" :form="form">
                <a-form-item class="login-form-item">
                  <a-input
                    v-decorator="formRule.username"
                    placeholder="Enter your username"
                  />
                </a-form-item>
                <a-form-item class="login-form-item">
                  <a-input
                    v-decorator="formRule.fullName"
                    placeholder="Enter your name"
                  />
                </a-form-item>
                <a-form-item class="login-form-item">
                  <a-input-password
                    v-decorator="formRule.password"
                    placeholder="Enter your password"
                  />
                </a-form-item>
                <a-form-item class="login-form-item">
                  <a-input-password
                    v-decorator="formRule.confirmPassword"
                    placeholder="Enter your confirm password"
                  />
                </a-form-item>
                <a-form-item class="login-form-item">
                  <a-button type="primary" class="w-100" html-type="submit">
                    Signup
                  </a-button>
                </a-form-item>
              </a-form>
              <p class="text-center">
                Have already an account?
                <router-link :to="{ name: 'app.login' }">Login now</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utilities from "@/utils/utilities";
import { mapState } from "vuex";
export default {
  data() {
    return {
      formRule: {
        username: [
          "username",
          {
            rules: [{ required: true, message: "Please input your username" }],
          },
        ],
        password: [
          "password",
          {
            rules: [
              {
                required: true,
                message: "Please input your password",
              },
            ],
          },
        ],
        confirmPassword: [
          "confirmPassword",
          {
            rules: [
              {
                required: true,
                message: "Please input your confirm password",
              },
            ],
          },
        ],
        fullName: [
          "fullName",
          {
            rules: [
              {
                required: true,
                message: "Please input your name",
              },
            ],
          },
        ],
      },
      form: this.$form.createForm(this, { name: "login" }),
      errorMessage: null,
    };
  },
  computed: {
    ...mapState("auth", {
      isLogined: state => state.isLogined,
    }),
  },
  methods: {
    signup(e) {
      e.preventDefault();
      this.errorMessage = null;
      this.form.validateFields(async (err, values) => {
        if (err) return;
        try {
          await this.$store.dispatch("auth/signup", values);
          if (this.isLogined) {
            this.$router.push({ name: "app.index" });
          }
        } catch (e) {
          if (e.errors) {
            const errors = {};
            Object.entries(e.errors).forEach(([key, value]) => {
              errors[key] = {
                errors: value.map(error => new Error(error)),
              };
            });
            return this.form.setFields(errors);
          }
          this.errorMessage = e.message;
        }
      });
    },
  },
};
</script>
<style scoped>
@import "../assets/styles/login.css";
</style>
