<template>
  <div style="padding:20px;border:1px solid green">
    counter:
    <button @click="innerCount--">-</button>
    {{innerCount}}
    <button @click="innerCount++">+</button>
  </div>
</template>

<script>
export default {
  inject: ["provider"],
  created() {
    this.$bus.$on("change", () => {
      this.innerCount++
    });
  },
  data() {
    return {
      innerCount: this.provider.count
    };
  },
  watch: {
    innerCount(val) {
      this.provider.sayHi();
      this.provider.count = val;
    }
  }
};
</script>

<style>
</style>