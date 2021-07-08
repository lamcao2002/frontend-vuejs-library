<template>
  <v-container>
    <v-row justify="center">
      <h1 class="display-2 font-weight-bold mb-2 mt-2 text-center">Login</h1>
      <v-form style="width: 40%">
        <v-text-field
          v-model="username"
          :error-messages="usernameErrors"
          label="Username"
          required
          @input="$v.username.$touch()"
          @blur="$v.username.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :error-messages="passwordErrors"
          label="Password"
          required
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
        ></v-text-field>

        <v-btn class="mr-4" @click="login"> Login </v-btn>
      </v-form>
    </v-row>
  </v-container>

  <!-- <form @submit.prevent="login">
    <h3>Login</h3>
    <div class="form-group">
      <label>Username</label>
      <input
        type="text"
        class="form-control"
        v-model="username"
        placeholder="Username"
      />
    </div>

    <div class="form-group">
      <label for="">Password</label>
      <input
        type="password"
        class="form-control"
        v-model="password"
        placeholder="Password"
      />
    </div>

    <button class="btn btn-primary btn-block">Login</button>
  </form> -->
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

import { mapMutations } from "vuex";

export default {
  mixins: [validationMixin],
  name: "Login",
  validations: {
    username: { required },
    password: { required },
  },
  data() {
    return {
      username: "",
      password: "",
      showPassword: false
    };
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.required && errors.push("Username is required.");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    },
  },
  methods: {
    ...mapMutations({
      setUserInfo: "SET_USER_INFO",
    }),

    async login() {
      const response = await axios.post("apis/auth/login", {
        username: this.username,
        password: this.password,
      });

      if (response.data.code === 200) {
        this.$notificate.showMessage({ content: response.data.message, color: 'success' });
        this.setUserInfo(response.data);
        this.$router.push({ name: "Home" });
      } else {
        // show wrong username & password into UI
        this.$notificate.showMessage({ content: response.data.errorMess, color: 'error' });
      }
      // localStorage.setItem("token", response.data.token);
      // //   localStorage.setItem("user", response.data.data.user);
      // console.log(response.data.data.user);
      // this.$router.push({ name: "Home" });
    },
    submit() {
      this.$v.$touch();
    },
  },
};
</script>