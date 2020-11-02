<template>
  <div style="padding:20px;border:1px solid red">
    show:
    <h2>{{nickname}}</h2>
    <button @click="update">修改</button>
    <Counter></Counter>
  </div>
</template>

<script>
import Counter from "~/Counter";
export default {
  components: {
    Counter
  },
  methods: {
    update() {
      this.$store.commit("setNickname", "ace");
    }
  },
  computed: {
    nickname() {
      return this.$store.state.nickname;
    }
  }
};
</script>

<style>
</style>