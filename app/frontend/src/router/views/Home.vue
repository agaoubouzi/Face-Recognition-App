<template>
  <header
    class="uk-navbar-container header uk-flex uk-flex-middle uk-flex-right@l"
  >
    <Welcome :username="this.userName" />
    <LogOut />
  </header>
  <main>
    <h1
      class="uk-text-center uk-margin-large uk-margin-medium-top uk-heading-medium"
    >
      Face Recognition App
    </h1>
    <FaceApp @userName="handleUserName" />
  </main>
</template>

<script>
import FaceApp from "../../components/FaceApp.vue";
import LogOut from "../../components/LogOut.vue";
import Welcome from "../../components/Welcome.vue";

export default {
  components: {
    FaceApp,
    LogOut,
    Welcome,
  },
  data() {
    return {
      userName: "",
    };
  },
  methods: {
    handleUserName(user) {
      this.userName = user;
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  position: absolute;
  padding: 1.5rem 3rem;
}
main {
  padding-top: 5rem;
}
</style>
