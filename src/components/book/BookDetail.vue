<template>
  <div>
    <v-container>
      <v-row align="center">
        <v-col cols="12" md="4">
          <v-container
            class="fill-width d-flex justify-center"
            fluid
            style="min-width: 200px"
          >
            <v-card class="d-inline-flex">
              <v-img
                :src="
                  book.cover
                    ? 'http://localhost:3000/' + book.cover
                    : 'http://localhost:3000/public/covers/default-image.jpg'
                "
                class="grey darken-4"
                max-width="100%"
                max-height="100%"
              ></v-img>
            </v-card>
          </v-container>
        </v-col>
        <v-col cols="12" md="8">
          <v-row>
            <v-col cols="12">
              <h1>{{ book.title }}</h1>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="2"> <label>Category:</label></v-col>
                <v-col cols="10">
                  <div>{{ book.category.title }}</div></v-col
                >
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="2"> <label>Author:</label></v-col>
                <v-col cols="10">
                  <div>{{ book.author }}</div></v-col
                >
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col cols="2"> <label>Owner:</label></v-col>
                <v-col cols="10">
                  <div>{{ getFullName }}</div></v-col
                >
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <h4>Description</h4>
        <v-col cols="12">
          <p>
            {{ book.description }}
          </p>
        </v-col>
      </v-row>
    </v-container>
    <v-footer dark padless>
      <v-card flat tile class="indigo lighten-1 white--text text-center">
        <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-4 white--text"
            icon
          >
            <v-icon size="24px">
              {{ icon }}
            </v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet.
          Mauris cursus commodo interdum. Praesent ut risus eget metus luctus
          accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim
          a sit amet dui. Duis commodo vitae velit et faucibus. Morbi vehicula
          lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus
          iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum
          tempor vel ut orci. Orci varius natoque penatibus et magnis dis
          parturient montes, nascetur ridiculus mus.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "BookDetail",
  data() {
    return {
      check: false,
      book: {},
      icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
    };
  },
  computed: {
    getFullName() {
      return this.book.owner.firstName + " " + this.book.owner.lastName;
    },
  },
  methods: {
    ...mapGetters({
      getBookInfo: "GET_BOOK_INFO",
    }),
    ...mapMutations({
      resetBookInfo: "RESET_BOOK_INFO",
    }),
  },
  created() {
    this.book = this.getBookInfo();
  },
  destroyed() {
    // this.resetBookInfo()
  },
};
</script>