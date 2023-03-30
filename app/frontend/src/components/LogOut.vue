<script>
export default {
  methods: {
    signOut() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>
<template>
  <span
    class="logout uk-text-light uk-flex uk-flex-middle"
    @click="signOut"
    uk-icon="icon: sign-out"
    >Sign out
  </span>
</template>

<style lang="scss" scoped>
.logout {
  cursor: pointer;
  gap: 5px;
}
</style>
