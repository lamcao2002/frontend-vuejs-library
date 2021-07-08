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
        <div class="display-1 font-weight-light">Edit book</div>
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
              @keyup="handleBtnEdit"
            ></v-text-field>
            <!-- <v-text-field
              v-model="category"
              :error-messages="categoryErrors"
              label="Category"
              required
              @input="$v.category.$touch()"
              @blur="$v.category.$touch()"
              @keyup="handleBtnEdit"
            ></v-text-field> -->
            <!-- Category -->
            <v-select
              v-model="category"
              :items="getTitleCategory"
              label="Category"
              :error-messages="categoryErrors"
              @blur="$v.category.$touch()"
              required
            ></v-select>
            <v-text-field
              v-model="author"
              :error-messages="authorErrors"
              label="Author"
              required
              @input="$v.author.$touch()"
              @blur="$v.author.$touch()"
              @keyup="handleBtnEdit"
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
              @change="handleBtnEdit"
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
            <v-textarea
              v-model="description"
              auto-grow
              rows="3"
              @keyup="handleBtnEdit"
            >
              <template v-slot:label>
                <div>Description <small>(optional)</small></div>
              </template>
            </v-textarea>

            <v-btn
              class="mr-4"
              @click="editBook"
              :disabled="
                !(
                  this.$v.title.required &&
                  this.$v.category.required &&
                  this.$v.author.required &&
                  editted
                )
              "
            >
              Edit
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

import { mapGetters, mapMutations} from "vuex";

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
      id: "",
      title: "",
      category: "",
      author: "",
      owner: "  ",
      cover: null,
      description: "",
      editted: false,
      categories: [],
      checkEmptyCover: null
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
      return this.owner.firstName + " " + this.owner.lastName;
    },
    getTitleCategory(){
      return (this.categories.map(item => {
        return item.title
      }))
    },
    getIdCategory(){
      return (this.categories.filter(item => {
        return item.title === this.category
      }))
    },
  },
  methods: {
    ...mapGetters({
      getUserInfo: "GET_USER_INFO",
      getBookInfo: "GET_BOOK_INFO",
    }),
    ...mapMutations({
      resetBookInfo: "RESET_BOOK_INFO",
    }),
    async editBook() {
      let formData = new FormData();
      formData.append("cover", this.cover);
      formData.append("title", this.title);
      formData.append("category", this.getIdCategory[0]._id);
      formData.append("author", this.author);
      formData.append("description", this.description);
      formData.append("checkEmptyCover", this.checkEmptyCover);
      const response = await axios.put("apis/books/" + this.id, formData);
      console.log(response);
      if (response.data.code === 200) {
        this.$notificate.showMessage({ content: response.data.message, color: 'success' });
        this.$router.push({ name: "BooksManagement" });
      } else {
        // show wrong username & password into UI
        this.$notificate.showMessage({ content: "Lỗi", color: 'success' });
      }
      // localStorage.setItem("token", response.data.token);
      // //   localStorage.setItem("user", response.data.data.user);
      // console.log(response.data.data.user);
      // this.$router.push({ name: "Home" });
    },
    async getCategories() {
      const condition1 = {
        sort_column: 'title',
        sort_direction: '',
      };

      const response = await axios.post("apis/categories/paging", {
        condition: condition1,
      });

      if (response.data) {
        const {
          docs: categories,
        } = response.data.categories;
        
        this.categories = categories;
      }
    },
    submit() {
      this.$v.$touch();
    },

    async convertUrlImage(cover) { // url -> public/covers/1624997000377_sach.png
      if (cover) {
        const response = await fetch("http://localhost:3000/" + cover);
        // here image is url/location of image
        const blob = await response.blob();
        const fileName = cover.slice(cover.lastIndexOf("_") + 1);
        const file = new File([blob], fileName, { type: blob.type });
        console.log(file);
        // return file
        this.cover = file;
      }
    },

    handleBtnEdit() {
      this.editted = true;
    },
  },
  created() {
    // this.owner = this.getUserInfo();
    const book = this.getBookInfo();
    this.id = book._id;
    this.title = book.title;
    this.category = book.category.title;
    this.author = book.author;
    this.owner = book.owner;
    this.description = book.description;
    this.checkEmptyCover = book.category.cover ? false : true
    this.convertUrlImage(book.cover);

    this.getCategories()
  },
  destroyed(){
    // this.resetBookInfo()
  }
};
</script>