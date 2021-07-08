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
        <div class="display-1 font-weight-light">Edit User</div>
      </template>

      <!-- Form book -->
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
              @keyup="handleBtnEdit"
            ></v-text-field>
            <!-- <v-text-field
              v-model="password"
              :error-messages="passwordErrors"
              label="Password"
              required
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
              disabled
              type="password"
            ></v-text-field> -->
            <v-text-field
              v-model="firstName"
              :error-messages="firstNameErrors"
              label="First Name"
              required
              @input="$v.firstName.$touch()"
              @blur="$v.firstName.$touch()"
              @keyup="handleBtnEdit"
            ></v-text-field>
            <v-text-field
              v-model="lastName"
              :error-messages="lastNameErrors"
              label="Last Name"
              required
              @input="$v.lastName.$touch()"
              @blur="$v.lastName.$touch()"
              @keyup="handleBtnEdit"
            ></v-text-field>
            <!-- Role -->
            <v-select
              v-model="role"
              :items="items"
              label="Role"
              @change="handleBtnEdit"
            ></v-select>

            <v-btn
              class="mr-4"
              @click="editUser"
              :disabled="
                !(
                  this.$v.username.required &&
                  this.$v.firstName.required &&
                  this.$v.lastName.required &&
                  editted
                )
              "
            >
              Edit
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

import { mapGetters, mapMutations } from "vuex";

export default {
  mixins: [validationMixin],
  name: "EditUser",
  validations: {
    username: { required },
    // password: { required },
    firstName: { required },
    lastName: { required },
    role: { required },
  },
  data() {
    return {
      check: false,
      id: "",
      username: "",
      // password: "",
      firstName: "",
      lastName: "",
      role: "normal",
      items: ["normal", "admin", "contributor"],
      editted: false,
      usernameChange: true //true : changed | false : not change
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
    ...mapGetters({
      getUserAdminInfo: "GET_USER_ADMIN_INFO",
    }),
    ...mapMutations({
      resetUserAdminInfo: "RESET_USER_ADMIN_INFO",
    }),
    async editUser() {
      if(this.username === this.getUserAdminInfo().username){
        this.usernameChange = false
      }else {
        this.usernameChange = true
      }
      const response = await axios.put("apis/users/" + this.id, {
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role,
        usernameChange: this.usernameChange
      });
      console.log(response);
      if (response.data.code === 200) {
        // this.$router.push({ name: "Home" });
        if (response.data.data) {
          this.$notificate.showMessage({ content: response.data.message, color: 'success' });
          this.$router.push({ name: "UsersManagement" });
        } else {
          this.$notificate.showMessage({ content: response.data.errorMess, color: 'error' });
        }
      } else {
        // show wrong username & password into UI
        this.$notificate.showMessage({ content: response.data.errorMess, color: 'error' });
      }
    },
    submit() {
      this.$v.$touch();
    },

    handleBtnEdit() {
      this.editted = true;
    },
  },
  created() {
    const user = this.getUserAdminInfo();
    this.id = user._id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role[0];
  },
  destroyed(){
    // this.resetUserAdminInfo()
  }
};
</script>