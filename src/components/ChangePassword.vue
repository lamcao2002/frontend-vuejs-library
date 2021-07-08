<template>
  <v-container>
    <v-row justify="center">
      <h1 class="display-2 font-weight-bold mb-2 mt-2 text-center">
        Change Password
      </h1>
      <v-form style="width: 40%">
        <v-text-field
          v-model="username"
          :error-messages="usernameErrors"
          label="Username"
          required
          @input="$v.username.$touch()"
          @blur="$v.username.$touch()"
          disabled
        ></v-text-field>

        <v-text-field
          v-model="oldPassword"
          :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :error-messages="oldPasswordErrors"
          label="Old Password"
          required
          @input="$v.oldPassword.$touch()"
          @blur="$v.oldPassword.$touch()"
          :type="showOldPassword ? 'text' : 'password'"
          @click:append="showOldPassword = !showOldPassword"
        ></v-text-field>

        <v-text-field
          v-model="newPassword"
          :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :error-messages="newPasswordErrors"
          label="New Password"
          required
          @input="$v.newPassword.$touch()"
          @blur="$v.newPassword.$touch()"
          :type="showNewPassword ? 'text' : 'password'"
          @click:append="showNewPassword = !showNewPassword"
        ></v-text-field>

        <v-text-field
          v-model="confirmPassword"
          :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :error-messages="confirmPasswordErrors"
          label="Confirm Password"
          required
          @input="$v.confirmPassword.$touch()"
          @blur="$v.confirmPassword.$touch()"
          :type="showConfirmPassword ? 'text' : 'password'"
          @click:append="showConfirmPassword = !showConfirmPassword"
        ></v-text-field>

        <v-btn class="mr-4" @click="changePassword"> Submit </v-btn>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  mixins: [validationMixin],
  name: "Register",
  validations: {
    username: { required },
    oldPassword: { required },
    newPassword: { required },
    confirmPassword: { required },
  },
  data() {
    return {
      username: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
    };
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.required && errors.push("Username is required.");
      return errors;
    },
    oldPasswordErrors() {
      const errors = [];
      if (!this.$v.oldPassword.$dirty) return errors;
      !this.$v.oldPassword.required && errors.push("Old Password is required");
      return errors;
    },
    newPasswordErrors() {
      const errors = [];
      if (!this.$v.newPassword.$dirty) return errors;
      !this.$v.newPassword.required && errors.push("New Password is required");
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      !this.$v.confirmPassword.required &&
        errors.push("Confirm Password is required");
      return errors;
    },
  },
  methods: {
    ...mapGetters({
      getUserInfor: "GET_USER_INFO",
    }),
    async changePassword() {
      if (this.newPassword === this.confirmPassword) {
        const response = await axios.post("apis/auth/changePassword", {
          username: this.username,
          password: this.oldPassword,
          newPassword: this.newPassword,
        });

        console.log(response);
        if (response.data.code === 200) {
          this.$notificate.showMessage({
            content: response.data.message,
            color: "success",
          });
          // this.$router.push("/login");
        } else {
          // show wrong username & password into UI
          this.$notificate.showMessage({
            content: response.data.errorMess,
            color: "error",
          });
        }
      } else {
        this.$notificate.showMessage({
          content: "Confirm Password wrong!",
          color: "error",
        });
      }
    },
  },
  created() {
    const usernameObj = this.getUserInfor();
    this.username = usernameObj.data.user.username;
  },
};
</script>