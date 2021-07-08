<template>
  <v-container id="data-tables" tag="section" class="mt-7">
    <!-- <base-v-component
      heading="Data Tables"
    /> -->

    <base-material-card
      color="indigo"
      icon="mdi-vuetify"
      inline
      class="px-5 py-3"
    >
      <template v-slot:after-heading>
        <div class="display-1 font-weight-light">New User</div>
      </template>

      <!-- Form user -->
      <v-container>
        <v-row justify="center">
          <!-- form -->
          <v-form style="width: 80%">
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
              :error-messages="passwordErrors"
              label="Password"
              required
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
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
            <!-- Role -->
            <v-select v-model="role" :items="items" label="Role"></v-select>

            <v-btn
              class="mr-4"
              @click="newUser"
              :disabled="
                !(
                  this.$v.username.required &&
                  this.$v.password.required &&
                  this.$v.firstName.required &&
                  this.$v.lastName.required
                )
              "
            >
              Submit
            </v-btn>
          </v-form>
        </v-row>
      </v-container>
    </base-material-card>
  </v-container>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  name: "AddUser",
  validations: {
    username: { required },
    password: { required },
    firstName: { required },
    lastName: { required },
    role: { required },
  },
  data() {
    return {
      check: false,
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "normal",
      items: ["normal", "admin", "contributor"],
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
      !this.$v.firstName.required && errors.push("First Name is required");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.lastName.$dirty) return errors;
      !this.$v.lastName.required && errors.push("Last Name is required");
      return errors;
    },
  },
  methods: {
    async newUser() {
      const response = await axios.post("apis/users", {
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,
        role: this.role,
      });
      if (response.data.code === 200) {
        // this.$router.push({ name: "Home" });
        if(response.data.data){
        this.$notificate.showMessage({ content: response.data.message, color: 'success' });
        this.$router.push({ name: "UsersManagement" });
        }else{
        this.$notificate.showMessage({ content: response.data.errorMess, color: 'error' });
        }
      } else {
        // show wrong username & password into UI
      }
    },
    submit() {
      this.$v.$touch();
    },
  },
};
</script>