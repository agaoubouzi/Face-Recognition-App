<template>
  <span
    class="profile uk-text-light uk-flex uk-flex-middle uk-margin-right"
    uk-icon="icon: user"
  >
    {{ this.username }}
  </span>
</template>
<script>
export default {
  props: {
    username: String,
  },
};
</script>

<style lang="scss" scoped>
.profile {
  text-transform: capitalize;
  gap: 5px;
}
</style>
