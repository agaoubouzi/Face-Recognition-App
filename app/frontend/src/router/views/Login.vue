<template>
  <div class="container">
    <div class="uk-card uk-card-default uk-card-body uk-text-center">
      <h2 class="uk-margin-bottom">{{ register ? "Register" : "Login" }}</h2>
      <form @submit.prevent="handleSubmit">
        <input
          type="text"
          v-model="username"
          class="uk-input"
          placeholder="Username"
        />
        <button
          type="submit"
          class="uk-button uk-button-default uk-margin-top"
          :disabled="processing"
        >
          {{ register ? "Register" : "login" }}
          <div v-if="processing" uk-spinner="ratio: .5"></div>
        </button>
      </form>
      <p>
        {{
          register ? "Already have an account?" : "Don't have an account yet?"
        }}
        <span class="clickable" @click="register = !register">
          {{ register ? "login" : "Register" }}
        </span>
      </p>
      <div v-if="message" :class="infoClass" uk-alert>
        <p>{{ message }}</p>
      </div>
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
      register: false,
      infoClass: "",
      message: "",
      processing: false,
    };
  },
  methods: {
    async handleSubmit() {
      const formData = new FormData();
      formData.append("username", this.username);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const url = this.register ? "/register" : "/login";

      await axios
        .post(`http://localhost:3000${url}`, formData, config)
        .then((response) => {
          const { token, user, message, infoclass } = response.data;
          this.token = token;
          this.user = user;
          localStorage.setItem("token", token);
          this.username = "";
          this.message = message;
          this.infoClass = infoclass;
          this.processing = true;
          // Redirect to the Home page
          setTimeout(() => {
            this.$router.push("/");
            this.processing = false;
          }, 1000);
        })
        .catch((error) => {
          console.error(error.message);
          this.infoClass = error.response.data.infoclass;
          this.message = error.response.data.message;
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
