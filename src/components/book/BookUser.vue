<template>
  <!-- <div>
    <h3 v-if="user">Hi, {{user.firstName}} {{user.lastName}}</h3>
    <h3 v-if="!user">You are not logged in!</h3>
  </div> -->

  <v-container>
    <v-toolbar flat class="my-5">
      <v-container>
        <v-row>
          <v-col>
            <v-chip-group
              active-class="deep-purple accent-4 white--text"
              column
            >
              <v-chip
                color="success"
                dark
                class="m-2 p-4"
                @click="handleFilter({})"
              >
                Tất cả
              </v-chip>
              <div
                v-for="item in categories"
                :key="item._id"
                class="d-inline-flex"
              >
                <v-chip
                  color="success"
                  dark
                  class="m-2 p-4"
                  @click="handleFilter(item)"
                >
                  <v-img
                    width="30px"
                    height="30px"
                    :src="
                      item.cover
                        ? 'http://localhost:3000/' + item.cover
                        : 'http://localhost:3000/public/covers/default-image.jpg'
                    "
                  />
                  {{ item.title }}
                </v-chip>
              </div>
            </v-chip-group>
          </v-col>
        </v-row>
      </v-container>
    </v-toolbar>
    <v-toolbar flat>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="ml-auto d-inline-flex"
        label="Search"
        hide-details
        single-line
        style="max-width: 250px"
        @keyup.enter="getListPaging"
      />
    </v-toolbar>
    <v-divider />
    <v-row>
      <v-col cols="12" md="3" v-for="book in listBook" :key="book.id">
        <ItemBook :book="book"> </ItemBook>
      </v-col>
    </v-row>
    <!-- No data text -->
    <template v-if="listBook.length === 0">
      <div class="d-flex justify-center mb-6">Book not found</div>
    </template>
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="totalPages"
        @input="getListPaging"
        circle
      ></v-pagination>
    </div>
  </v-container>
</template>
<script>
import axios from "axios";
import ItemBook from "./ItemBook.vue";

export default {
  name: "BookUser",
  // props: ["user", "page", "limit"],
  // props: ["user", "page"],
  props: ["user"],
  components: {
    ItemBook,
  },
  data: () => ({
    rowOfPage: 8,
    listBook: [],
    page: 1,
    totalPages: 0,
    search: "",
    idCategory: "",
    categories: [],
    toggle_exclusive: null,
    text: "center",
  }),
  computed: {
    getTitleCategory() {
      return this.categories.map((item) => {
        return item.title;
      });
    },
    getIdCategory() {
      return this.categories.filter((item) => {
        console.log(item.title);

        return item.title === this.category;
      });
    },
  },
  methods: {
    //Reading data from API method.
    async getListPaging() {
      const payload = {
        page: this.page,
        limit: this.rowOfPage,
        search: this.search,
        idCategory: this.idCategory,
      };
      const response = await axios.post("apis/books/paging", {
        condition: payload,
      });
      // console.log(response);
      if (response.data) {
        const { docs: books, limit, page, totalPages } = response.data.books;
        this.totalPages = totalPages;
        this.page = page;
        this.rowOfPage = limit;
        this.listBook = books;
      }
      // this.$router.push("?pages=" + this.page);
    },
    async getListCategory() {
      const condition1 = {
        sort_column: "title",
        sort_direction: "",
        limit: 20,
      };

      const response = await axios.post("apis/categories/paging", {
        condition: condition1,
      });

      if (response.data) {
        const { docs: categories } = response.data.categories;

        this.categories = categories;
      }
    },
    handleFilter(item) {
      this.idCategory = item._id;
      this.getListPaging();
    },
  },
  mounted() {
    this.getListPaging();
    this.getListCategory();
  },
};
</script>