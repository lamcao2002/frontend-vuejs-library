<template>
  <v-hover v-slot="{ hover }">
    <v-card :loading="loading" class="mx-auto" max-width="374">
      <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-img
        height="250"
        :src="
          book.cover
            ? 'http://localhost:3000/' + book.cover
            : 'http://localhost:3000/public/covers/default-image.jpg'
        "
        contain
      >
        <v-expand-transition>
          <div
            v-if="hover"
            class="
              d-flex
              transition-fast-in-fast-out
              red
              v-card--reveal
              display-3
              white--text
            "
            style="height: 100%"
          >
            <v-btn outlined="" color="white" @click="bookDetail">Detail</v-btn>
          </div>
        </v-expand-transition>
      </v-img>
      <v-card-text class="pt-6" style="position: relative">
        <v-btn absolute color="orange" class="white--text mr-0" fab right top>
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </v-card-text>
      <v-card-title>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on" class="three-dot-title">{{
              book.title
            }}</span>
          </template>
          <span>{{ book.title }}</span>
        </v-tooltip>
      </v-card-title>

      <v-card-text>
        <!-- <v-row align="center" class="mx-0">
          <v-rating
            :value="4.5"
            color="amber"
            dense
            half-increments
            readonly
            size="14"
          ></v-rating>

          <div class="grey--text ms-4">4.5 (413)</div>
        </v-row> -->

        <!-- <div class="my-4 text-subtitle-1">$ {{ price }}</div> -->

        <div>
          <!-- <span class="three-dot">{{ description }}</span> -->
          <span class="three-dot">{{ book.description }}</span>
        </div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <!-- <v-card-actions>
        <v-btn color="deep-purple lighten-2" text @click="buy"> Buy </v-btn>
      </v-card-actions> -->
    </v-card>
  </v-hover>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  props: {
    book: Object,
  },
  data: () => ({
    loading: false,
    selection: 1,
  }),

  methods: {
    ...mapMutations({
      setBookInfo: "SET_BOOK_INFO",
    }),
    buy() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 2000);
    },
    bookDetail() {
      this.setBookInfo(this.book);
      this.$router.push({ name: "BookDetail" });
    },
  },
};
</script>

<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
.three-dot {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.three-dot-title {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>