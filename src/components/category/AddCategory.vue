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
        <div class="display-1 font-weight-light">New Category</div>
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
                <div>Upload category's cover <small>(optional)</small></div>
              </template>
            </v-file-input>

            <v-btn class="mr-4" @click="newCategory" 
            :disabled="!(this.$v.title.required)">
             Submit </v-btn>
          </v-form>
        </v-row>
      </v-container>
    </base-material-card>
    <!-- <Snackbar></Snackbar> -->
  </v-container>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

// import Snackbar from "../SnackBar.vue";

export default {
  mixins: [validationMixin],
  name: "AddCategory",
  // components: { Snackbar },
  validations: {
    title: { required },
  },
  data() {
    return {
      check: false,
      title: "",
      cover: null,
    };
  },
  computed: {
    titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      !this.$v.title.required && errors.push("Title is required.");
      return errors;
    },
  },
  methods: {
    async newCategory() {
      let formData = new FormData();
      formData.append("cover", this.cover);
      formData.append("title", this.title);
      const response = await axios.post("apis/categories", formData);
      console.log(response)
      if (response.data.code === 200) {
        this.$router.push({ name: "CategoriesManagement" });
        this.$notificate.showMessage({ content: response.data.message, color: 'success' });
      } else {
        // show wrong username & password into UI
        this.$notificate.showMessage({ content: "Lỗi", color: 'error' });
      }
      // localStorage.setItem("token", response.data.token);
      // //   localStorage.setItem("user", response.data.data.user);
      // console.log(response.data.data.user);
      // this.$router.push({ name: "Home" });
    },
    submit() {
      this.$v.$touch();
    },
    clearInput(){
      this.title = "",
      this.cover = null
    }
  },
};
</script>