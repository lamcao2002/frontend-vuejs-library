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
        <div class="display-1 font-weight-light">List book</div>
      </template>
      <v-toolbar flat>
        <v-btn color="primary" dark class="mb-2" @click="newBook">
          New Book
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          class="ml-auto d-inline-flex"
          label="Search"
          hide-details
          single-line
          style="max-width: 250px"
          @keyup.enter="initialize"
        />
      </v-toolbar>
      <v-divider class="mt-3" />

      <v-data-table
        :page="page"
        :pageCount="numberOfPages"
        :server-items-length="totalBooks"
        :loading="loading"
        :options.sync="options"
        :items-per-page="limit"
        :headers="headers"
        :items="books"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <!-- Action btn -->
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <!-- Cover -->
        <template v-slot:item.cover="{ item }">
          <v-container class="fill-width" fluid style="min-width: 80px">
            <v-card class="d-inline-flex">
              <v-img
                :src="
                  item.cover
                    ? 'http://localhost:3000/' + item.cover
                    : 'http://localhost:3000/public/covers/default-image.jpg'
                "
                max-width="100px"
                class="grey darken-4"
              ></v-img>
            </v-card>
          </v-container>
        </template>
        <!-- owner -->
        <template v-slot:item.owner="{ item }">
          <div v-if="item">
            {{ item.owner.firstName + " " + item.owner.lastName }}
          </div>
        </template>
        <!-- category -->
        <template v-slot:item.category="{ item }">
          <div v-if="item">
            {{ item.category.title }}
          </div>
        </template>
        <!-- No data text -->
        <template v-slot:no-data>
          <!-- <v-btn color="primary" @click="initialize"> Reset </v-btn> -->
          <div>No-data</div>
        </template>
        <!--  -->
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
import axios from "axios";

import { mapMutations, mapGetters } from "vuex";

export default {
  name: "DashboardDataTables",

  data: () => ({
    page: 1,
    numberOfPages: 0,
    totalBooks: 0,
    loading: true,
    limit: 5,
    options: {},
    sortBy: "_id",
    sortDesc: "-",
    //
    dialog: false,
    dialogDelete: false,
    books: [],
    search: "",
    headers: [
      {
        text: "Image",
        align: "start",
        sortable: false,
        value: "cover",
      },
      { text: "Title", value: "title" },
      { text: "Category", value: "category" },
      { text: "Author", value: "author" },
      { text: "Owner", value: "owner" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    bookIdSelected: 0,
    owner: {},
    idOwner: "",
  }),

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    options: {
      handler(newValue) {
        this.page = newValue.page;
        this.limit = newValue.itemsPerPage;
        (this.sortBy = newValue.sortBy[0] || "_id"),
          (this.sortDesc = newValue.sortDesc[0] === false ? "" : "-");
        this.initialize();
      },
    },
    deep: true,
  },
  methods: {
    ...mapMutations({
      setBookInfo: "SET_BOOK_INFO",
    }),

    ...mapGetters({
      getUserInfo: "GET_USER_INFO",
    }),

    async initialize() {
      this.loading = true;

      const condition1 = {
        page: this.page,
        limit: this.limit,
        sort_column: this.sortBy,
        sort_direction: this.sortDesc,
        search: this.search,
        idOwner: this.idOwner,
      };

      const response = await axios.post("apis/books/paging", {
        condition: condition1,
      });

      this.loading = false;
      if (response.data) {
        const {
          docs: books,
          limit,
          page,
          totalPages,
          totalDocs,
        } = response.data.books;
        this.totalPages = totalPages;
        this.page = page;
        this.rowOfPage = limit;
        this.books = books;
        this.totalBooks = totalDocs;
      }
    },

    editItem(item) {
      // this.editedIndex = this.books.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      // this.dialog = true;
      this.setBookInfo(item);
      this.$router.push({ name: "EditBook" });
    },

    deleteItem(item) {
      this.bookIdSelected = item._id;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      // call api delete
      const response = await axios.delete("apis/books/" + this.bookIdSelected);
      if (response.data.code === 200) {
        this.$notificate.showMessage({
          content: response.data.message,
          color: "success",
        });
        this.initialize();
      }
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    newBook() {
      this.$router.push({ name: "AddBook" });
    },
  },
  mounted() {
    this.initialize();
  },
  created() {
    this.owner = this.getUserInfo();
    if (this.owner.data.user.role[0] === "contributor") {
      this.idOwner = this.owner.data.user._id;
    }
  },
};
</script>

