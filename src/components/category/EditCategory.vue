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
        <div class="display-1 font-weight-light">Edit category</div>
      </template>

      <!-- Form category -->
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
                <div>Upload category's cover <small>(optional)</small></div>
              </template>
            </v-file-input>

            <v-btn
              class="mr-4"
              @click="editCategory"
              :disabled="
                !(
                  this.$v.title.required &&
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

import { mapGetters, mapMutations } from "vuex";

export default {
  mixins: [validationMixin],
  name: "EditCategory",
  validations: {
    title: { required },
  },
  data() {
    return {
      check: false,
      id: "",
      title: "",
      cover: null,
      editted: false,
      checkEmptyCover: null
    };
  },
  computed: {
    titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      !this.$v.title.required && errors.push("Title is required.");
      return errors;
    }
  },
  methods: {
    ...mapGetters({
      getCategoryInfo: "GET_CATEGORY_INFO",
    }),
    ...mapMutations({
      resetCategoryInfo: "RESET_CATEGORY_INFO",
    }),
    async editCategory() {
      let formData = new FormData();
      formData.append("cover", this.cover);
      formData.append("title", this.title);
      formData.append("checkEmptyCover", this.checkEmptyCover);
      const response = await axios.put("apis/categories/" + this.id, formData);
      console.log(response);
      if (response.data.code === 200) {
        this.$notificate.showMessage({ content: response.data.message, color: 'success' });
        this.$router.push({ name: "CategoriesManagement" });
      } else {
        // show wrong username & password into UI
        this.$notificate.showMessage({ content: response.data.errorMess, color: 'error' });
      }
      // localStorage.setItem("token", response.data.token);
      // //   localStorage.setItem("user", response.data.data.user);
      // console.log(response.data.data.user);
      // this.$router.push({ name: "Home" });
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
    const category = this.getCategoryInfo();
    this.id = category._id;
    this.title = category.title;
    this.checkEmptyCover = category.cover ? false : true
    this.convertUrlImage(category.cover);
  },
  destroyed(){
    // this.resetCategoryInfo()
  }
};
</script>