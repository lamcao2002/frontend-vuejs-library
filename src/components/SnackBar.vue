<template>
  <v-snackbar id="snackbar" v-model="show" :color="color" bottom>
    {{ message }}
    <!-- <v-btn text @click="show = false">Close</v-btn> -->
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      message: '',
      color: ''
    }
  },

  created () {
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'SHOW_TOASK') {
        this.message = mutation.payload.content
        this.color = mutation.payload.color
        this.show = true
        
      }
    })
  }
}
</script>
<style>
.v-snack__content {
  font-size: 20px;
}
</style>