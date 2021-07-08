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
        <div class="display-1 font-weight-light">List User</div>
      </template>
      <v-toolbar flat>
        <v-btn color="primary" dark class="mb-2" @click="newUser">
          New User
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
          @keyup="initialize"
        />
      </v-toolbar>
      <v-divider class="mt-3" />

      <v-data-table
        :page="page"
        :pageCount="numberOfPages"
        :server-items-length="totalUsers"
        :loading="loading"
        :options.sync="options"
        :items-per-page="limit"
        :headers="headers"
        :items="users"
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
    
        <!-- Reset btn -->
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> Reset </v-btn>
        </template>
        <!--  -->
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
import axios from "axios";

import { mapMutations } from "vuex";

export default {
  name: "UsersManagement",

  data: () => ({
    page: 1,
    numberOfPages: 0,
    totalUsers: 0,
    loading: true,
    limit: 5,
    options: {},
    sortBy: '_id',
    sortDesc: '-',
    //
    dialog: false,
    dialogDelete: false,
    users: [],
    search: '',
    headers: [
      { text: "Username", value: "username" },
      { text: "First Name", value: "firstName" },
      { text: "Last Name", value: "lastName" },
      { text: "Role", value: "role" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    userIdSelected: 0,
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
        this.sortBy = newValue.sortBy[0] || '_id',
        this.sortDesc = newValue.sortDesc[0] === false ? '' : '-'
        this.initialize();
      },
    },
    deep: true,
  },

  // created() {
  //   this.initialize();
  // },

  methods: {
    ...mapMutations({
      setUserAdminInfo: "SET_USER_ADMIN_INFO",
    }),

    async initialize() {
      this.loading = true;

      const condition1 = {
        page: this.page,
        limit: this.limit,
        sort_column: this.sortBy,
        sort_direction: this.sortDesc,
        search: this.search
      };

      const response = await axios.post("apis/users/paging", {
        condition: condition1,
      });

      this.loading = false;
      if (response.data) {
        const {
          docs: users,
          limit,
          page,
          totalPages,
          totalDocs,
        } = response.data.users;
        this.totalPages = totalPages;
        this.page = page;
        this.rowOfPage = limit;
        this.users = users;
        this.totalUsers = totalDocs;
      }
    },

    editItem(item) {
      this.setUserAdminInfo(item);
      this.$router.push({ name: "EditUser" });
    },

    deleteItem(item) {
      this.userIdSelected = item._id;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      // call api delete
      const response = await axios.delete("apis/users/" + this.userIdSelected);
      if (response.data.code === 200) {
        this.$notificate.showMessage({ content: response.data.message, color: 'success' });
        this.initialize();
      }
      else{
        this.$notificate.showMessage({ content: response.data.errorMess, color: 'error' });
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

    newUser() {
      this.$router.push({ name: "AddUser" });
    },

  },
  mounted() {
    this.initialize();
  },
};
</script>

