<template>
  <div
    v-if="user"
    class="app_container uk-flex uk-flex-top uk-flex-center uk-flex-wrap"
  >
    <div class="uk-card uk-card-default uk-card-body uk-width-auto">
      <h2 class="uk-card-title uk-text-capitalize">
        Welcome {{ user.username }}! 👋
      </h2>
      <form @submit.prevent="createRequest">
        <input
          type="text"
          id="name"
          placeholder="Name"
          class="uk-input"
          v-model="name"
          required
        />
        <div uk-form-custom>
          <input
            type="file"
            id="image"
            accept="image/*"
            @change="handleFileUpload"
            aria-label="Custom controls"
          />
          <button
            class="uk-button uk-button-default uk-margin-top uk-pointer"
            type="button"
            tabindex="-1"
          >
            Select Image
          </button>

        </div>

        <button
          type="submit"
          class="uk-button uk-button-primary uk-margin-top uk-display-block"
          :disabled="!file || !name || processing"
        >
          {{ processing ? "Processing..." : "Create Request" }}
          <div v-if="processing" uk-spinner="ratio: .5"></div>
        </button>
        <span v-if="message" class="uk-alert-danger" uk-alert>{{message}}</span>
      </form>
    </div>
    <div class="uk-card uk-card-default uk-card-body uk-width-auto">
      <h3 class="uk-card-title">My Requests:</h3>
      <table
        class="uk-table uk-table-justify uk-table-divider uk-table-striped"
      >
        <thead>
          <tr>
            <th class="uk-width-small">Name</th>
            <th>Expression</th>
            <th>Faces #</th>
            <th>Thumbnail</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in requests" :key="request.name">
            <td>{{ request.name }}</td>
            <td>{{ request.expression ? request.expression : '-'  }}</td>
            <td>{{ request.numFaces }}</td>
            <td class="thumbnail" >
              <img :src="request.dataUrl" alt="Face thumbnail" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      username: "",
      token: "",
      user: null,
      error: "",
      name: "",
      file: null,
      requests: [],
      message:"",
      processing: false,
    };
  },
  methods: {
    createRequest() {
      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("image", this.file);
      this.processing = true;

      axios
        .post("http://localhost:3000/requests", formData, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.requests.unshift(response.data);
          this.name = "";
          this.file = null;
          this.processing = false;
          this.message = '';
        })
        .catch((error) => {
          this.processing = false;
          this.message = error.response.data.message;
        });
    },

    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
  },
  created() {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.token = token;
          this.user = response.data;
          this.$emit("userName", this.user.username);
        })
        .catch((error) => {
          console.error(error);
          this.$router.push("/login");
        });
    } 
  },
};
</script>
<style lang="scss" scoped>
.app_container {
  gap: 40px;
  table {
    tbody {
      tr{
        td{
          &:first-type(){
          padding-left:5px;
        }
        }
      }
      .thumbnail {
        img {
          width: 50px;
          height: 50px;
        }
      }
    }
  }
}
</style>
