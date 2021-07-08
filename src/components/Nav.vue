<template>
  <nav class="navbar navbar-expand navbar-light fixed-top">
    <div class="container">
      <router-link to="/" class="navbar-brand">Home</router-link>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav" v-if="!user">
          <li class="nav-item">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/register" class="nav-link">Sign up</router-link>
          </li>
        </ul>

        <ul class="navbar-nav" v-if="user">
          <li class="nav-item">
            <a href="javascript:void(0)" class="nav-link" @click="logout">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
    name: 'Nav',
    props: ['user'],
    methods: {
      logout() {
        localStorage.removeItem('token')
        this.$router.push('/')
      }
    }
};
</script>