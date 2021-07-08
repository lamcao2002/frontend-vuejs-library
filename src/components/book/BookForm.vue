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
        <div class="display-1 font-weight-light">New book</div>
      </template>

      <!-- Form book -->
      <v-container>
        <v-row justify="center">
          <v-form style="width: 80%">
            <v-text-field
              v-model="title"
              :error-messages="titleErrors"
              label="Title"
              required
              @input="$v.title.$touch()"
              @blur="$v.title.$touch()"
            ></v-text-field>
            <!-- <v-text-field
              v-model="category"
              :error-messages="categoryErrors"
              label="Category"
              required
              @input="$v.category.$touch()"
              @blur="$v.category.$touch()"
            ></v-text-field> -->
            <!-- Category -->
            <v-select
              v-model="category"
              :items="getTitleCategory"
              label="Category"
              :error-messages="categoryErrors"
              @blur="$v.category.$touch()"
              required
              @change="test"
            >
            </v-select>

            <v-text-field
              v-model="author"
              :error-messages="authorErrors"
              label="Author"
              required
              @input="$v.author.$touch()"
              @blur="$v.author.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="getFullName"
              label="Owner"
              disabled
            ></v-text-field>
            <!-- Cover -->
            <v-file-input
              v-model="cover"
              placeholder="Choose file..."
              accept="image/png, image/jpeg, image/bmp"
              append-icon="mdi-paperclip"
              prepend-icon=""
              ref="myfile"
            >
              <template v-slot:selection="{ text }">
                <v-chip label color="primary">
                  {{ text }}
                </v-chip>
              </template>
              <template v-slot:label>
                <div>Upload book's cover <small>(optional)</small></div>
              </template>
            </v-file-input>
            <!-- description -->
            <v-textarea v-model="description" auto-grow rows="3">
              <template v-slot:label>
                <div>Description <small>(optional)</small></div>
              </template>
            </v-textarea>

            <v-btn
              class="mr-4"
              @click="newBook"
              :disabled="
                !(
                  this.$v.title.required &&
                  this.$v.category.required &&
                  this.$v.author.required
                )
              "
            >
              Submit
            </v-btn>
          </v-form>
        </v-row>
      </v-container>
    </base-material-card>
  </v-container>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

import { mapGetters } from "vuex";

export default {
  mixins: [validationMixin],
  name: "BookForm",
  validations: {
    title: { required },
    category: { required },
    author: { required },
  },
  data() {
    return {
      check: false,
      title: "",
      category: "",
      author: "",
      owner: "  ",
      cover: null,
      description: "",
      categories: [],
    };
  },
  computed: {
    titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      !this.$v.title.required && errors.push("Title is required.");
      return errors;
    },
    categoryErrors() {
      const errors = [];
      if (!this.$v.category.$dirty) return errors;
      !this.$v.category.required && errors.push("Category is required");
      return errors;
    },
    authorErrors() {
      const errors = [];
      if (!this.$v.author.$dirty) return errors;
      !this.$v.author.required && errors.push("Author is required");
      return errors;
    },
    getFullName() {
      return (
        this.owner.data.user.firstName + " " + this.owner.data.user.lastName
      );
    },
    getTitleCategory(){
      return (this.categories.map(item => {
        return item.title
      }))
    },
    getIdCategory(){
      console.log("cate " + this.category)
      console.log(this.categories)
      return (this.categories.filter(item => {
      console.log(item.title)
        
        return item.title === this.category
      }))
    }
  },
  methods: {
    ...mapGetters({
      getUserInfo: "GET_USER_INFO",
    }),
    async newBook() {
      let formData = new FormData();
      formData.append("cover", this.cover);
      formData.append("title", this.title);
      formData.append("category", this.getIdCategory[0]._id);
      formData.append("author", this.author);
      formData.append("owner", this.owner.data.user._id);
      formData.append("description", this.description);
      const response = await axios.post("apis/books", formData);
      console.log(response);
      if (response.data.code === 200) {
        this.$notificate.showMessage({ content: response.data.message, color: 'success' });
        this.$router.push({ name: "BooksManagement" });
      } else {
        // show wrong username & password into UI
        this.$notificate.showMessage({ content: response.data.errorMess, color: 'error' });
      }
      // localStorage.setItem("token", response.data.token);
      // //   localStorage.setItem("user", response.data.data.user);
      // console.log(response.data.data.user);
      // this.$router.push({ name: "Home" });
    },
    async getCategories() {
      const condition1 = {
        sort_column: "title",
        sort_direction: "",
      };

      const response = await axios.post("apis/categories/paging", {
        condition: condition1,
      });

      if (response.data) {
        const { docs: categories } = response.data.categories;

        this.categories = categories;
      }
    },
    submit() {
      this.$v.$touch();
    },
    test(){
      console.log(this.getIdCategory[0]._id)
    }
  },
  created() {
    this.owner = this.getUserInfo();
    this.getCategories();
  },
};
</script>