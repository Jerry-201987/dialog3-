<template>
  <div id='app'>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
};
</script>

<style>
@import "/iconfont/iconfont.css";

* {
  margin: 0;
  padding: 0;
  list-style: none;
  outline: none;
}

a {
  text-decoration: none;
  color: #000;
}

.flex {
  display: flex;
}

.a-c {
  align-items: center;
}

.j-s {
  justify-content: space-between;
}
</style>
