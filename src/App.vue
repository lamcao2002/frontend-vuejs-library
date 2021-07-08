<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
          @click="homePage"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
          @click="homePage"
        />
      </div>

      <v-spacer></v-spacer>

      <router-link
        to="dashboard"
        v-if="
          this.getUserInfo()
            ? ['admin', 'contributor'].includes(
                this.getUserInfo().data.user.role[0]
              )
              ? true
              : false
            : false
        "
      >
        <span class="mr-2 text-white">Dashboard</span>
      </router-link>
      <router-link to="login" v-if="!getToken()">
        <span class="mr-2 text-white">Login</span>
      </router-link>
      <router-link to="register" v-if="!getToken()">
        <span class="mr-2 text-white">Register</span>
      </router-link>
      <router-link to="change-password" v-if="getToken()">
        <span class="mr-2 text-white">Change Password</span>
      </router-link>
      <router-link to="login" v-if="getToken()">
        <span class="mr-2 text-white" @click="logout">Logout</span>
      </router-link>
    </v-app-bar>

    <v-main>
      <div>
        <Snackbar></Snackbar>
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script>
// import axios from "axios";
import { mapMutations, mapGetters } from "vuex";
import Snackbar from "./components/SnackBar.vue";

export default {
  name: "App",

  components: { Snackbar },

  data: () => ({
    //
    role: "",
    user: null,
  }),
  methods: {
    ...mapMutations({
      resetUserInfo: "RESET_USER_INFO",
    }),
    ...mapGetters({
      getToken: "GET_TOKEN",
      getUserInfo: "GET_USER_INFO",
    }),
     logout() {
      // const response = await axios.post("apis/auth/logout");
      // if (response.data.code === 200) {
      //   this.resetUserInfo();

      //   this.$router.push("/pages/login");
      // }
      this.resetUserInfo();
      // this.$router.push({ name: "Login" });
    },
    getRoleUser() {
      if (this.getUserInfo()) {
        this.role = this.getUserInfo.role;
      }
    },
    homePage() {
      this.$router.push({ name: "Home" });
    },
  },
  mounted() {},
};
</script>
