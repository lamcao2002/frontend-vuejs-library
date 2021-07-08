<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-img
        src="https://cdn.vuetifyjs.com/images/lists/ali.png"
        height="150px"
      >
        <v-row class="fill-height">
          <v-card-title class="white--text d-flex justify-content-center">
            <div class="text-h4">Dashboard</div>
          </v-card-title>
        </v-row>
      </v-img>
      <!--  -->
      <v-list nav>
        <v-list-item-group v-model="selectedItem" color="primary">
          <div v-for="item in items" :key="item.title">
            <v-list-item v-if="!item.children" link :to="item.to">
              <v-list-item-icon>
                <v-icon color="primary">{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="primary--text">{{
                  item.title
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- ----- -->
            <v-list-group v-else>
              <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon color="primary">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="primary--text">{{
                  item.title
                }}</v-list-item-title>
              </template>
              <v-list-item
                v-for="itemSub in item.children"
                :key="itemSub.title"
                link
                :to="item.group + itemSub.to"
              >
                <v-list-item-content>
                  <v-list-item-title class="black--text">
                    <v-list-item-icon>
                      <v-icon color="primary" class="subtitle-1">{{
                        itemSub.title
                          .toUpperCase()
                          .split(" ")
                          .reduce((textIcon, word) => {
                            return textIcon + word.slice(0, 1);
                          }, "")
                      }}</v-icon>
                    </v-list-item-icon>

                    {{ itemSub.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
            <!-- ----- -->
          </div>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark color="primary" elevation="0">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Dashboard</v-toolbar-title>
    </v-app-bar>

    <v-main class="p-0">
      <!--  -->
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  // components: { Snackbar },
  data: () => ({
    selectedItem: 1,
    drawer: null,
    // items: [
    //   { title: "Home", to: "/", icon: "mdi-home-outline" },
    //   {
    //     title: "Book",
    //     group: "/dashboard",
    //     icon: "mdi-palette-swatch",
    //     children: [
    //       {
    //         title: "Books Management",
    //         to: "/books-management",
    //       },
    //       {
    //         title: "Add Book",
    //         to: "/add-book",
    //       },
    //     ],
    //   },
    //   {
    //     title: "Category",
    //     group: "/dashboard",
    //     icon: "mdi-palette-swatch",
    //     children: [
    //       {
    //         title: "Categories Management",
    //         to: "/categories-management",
    //       },
    //       {
    //         title: "Add Category",
    //         to: "/add-category",
    //       },
    //     ],
    //   },
    //   {
    //     title: "User",
    //     group: "/dashboard",
    //     icon: "mdi-palette-swatch",
    //     children: [
    //       {
    //         title: "Users Management",
    //         to: "/users-management",
    //       },
    //       {
    //         title: "Add User",
    //         to: "/add-user",
    //       },
    //     ],
    //   },
    // ],
    role: "",
    items: [],
    permission: [
      {
        roles: "admin",
        items: [
          { title: "Home", to: "/", icon: "mdi-home-outline" },
          {
            title: "Book",
            group: "/dashboard",
            icon: "mdi-palette-swatch",
            children: [
              {
                title: "Books Management",
                to: "/books-management",
              },
              {
                title: "Add Book",
                to: "/add-book",
              },
            ],
          },
          {
            title: "Category",
            group: "/dashboard",
            icon: "mdi-palette-swatch",
            children: [
              {
                title: "Categories Management",
                to: "/categories-management",
              },
              {
                title: "Add Category",
                to: "/add-category",
              },
            ],
          },
          {
            title: "User",
            group: "/dashboard",
            icon: "mdi-palette-swatch",
            children: [
              {
                title: "Users Management",
                to: "/users-management",
              },
              {
                title: "Add User",
                to: "/add-user",
              },
            ],
          },
        ],
      },
      {
        roles: "contributor",
        items: [
          { title: "Home", to: "/", icon: "mdi-home-outline" },
          {
            title: "Book",
            group: "/dashboard",
            icon: "mdi-palette-swatch",
            children: [
              {
                title: "Books Management",
                to: "/books-management",
              },
              {
                title: "Add Book",
                to: "/add-book",
              },
            ],
          },
        ],
      },
    ],
  }),
  methods: {
    ...mapGetters({
      getRole: "GET_ROLE",
    }),
  },
  created() {
    this.role = this.getRole();
    const itemsObj = this.permission.find(({ roles }) => roles === this.role);
    this.items = itemsObj.items
  },
};
</script>