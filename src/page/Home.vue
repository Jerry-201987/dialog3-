<template>
  <div style="padding: 20px; border: 1px solid purple">
    <!-- home:
    <h2><input type="text" v-model="$store.state.nickname" /></h2>
    <h1>{{ count }}</h1>
    <Show></Show>
    <hr />
    <Foo></Foo>
    <ul>
      <li v-for="item in $store.getters.female">
        {{ item.name }}
      </li>
    </ul> -->
    <Role></Role>
  </div>
</template>

<script>
import Show from "~/Show";
import Foo from "~/Foo";
import Role from '@/views/Role'
export default {
  components: {
    Show,
    Foo,
    Role
  },
  computed: {
    // male(){
    //   return this.$store.getters.male
    // }
    nickname() {
      return this.$store.state.nickname;
    },
  },
  provide() {
    return {
      provider: this,
    };
  },
  data() {
    return {
      count: 22,
    };
  },
  methods: {
    sayHi() {
      console.log("hi");
    },
  },
};
</script>

<style>
</style>