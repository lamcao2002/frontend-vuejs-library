<template>
  <v-container>
    <v-row justify="center">
      <h1 class="display-2 font-weight-bold mb-2 mt-2 text-center">Sign Up</h1>
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
          v-model="firstName"
          :error-messages="firstNameErrors"
          label="First Name"
          required
          @input="$v.firstName.$touch()"
          @blur="$v.firstName.$touch()"
        ></v-text-field>

        <v-text-field
          v-model="lastName"
          :error-messages="lastNameErrors"
          label="Last Name"
          required
          @input="$v.lastName.$touch()"
          @blur="$v.lastName.$touch()"
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

        <v-btn class="mr-4" @click="signUp"> Sign up </v-btn>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  name: "Register",
  validations: {
    username: { required },
    password: { required },
    firstName: { required },
    lastName: { required },
  },
  data() {
    return {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
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
    firstNameErrors() {
      const errors = [];
      if (!this.$v.firstName.$dirty) return errors;
      !this.$v.firstName.required && errors.push("First Name is required.");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.lastName.$dirty) return errors;
      !this.$v.lastName.required && errors.push("Last Name is required.");
      return errors;
    },
  },
  methods: {
    async signUp() {
      const response = await axios.post("apis/auth/register", {
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,
      });

      console.log(response);
      if (response.data.code === 200) {
        this.$notificate.showMessage({
          content: response.data.message,
          color: "success",
        });
        this.$router.push("/login");
      } else {
        // show wrong username & password into UI
        this.$notificate.showMessage({
          content: response.data.errorMess,
          color: "error",
        });
      }
    },
  },
};
</script>