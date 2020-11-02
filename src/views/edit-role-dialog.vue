<template>
  <div :style="{ display: isShow ? 'block' : 'none' }">
    <h5>修改角色</h5>
    <dialog-box :dialog-visible="isShow" @close="close" />
    <!-- <dialog-box :dialog-visible.sync="isShow" @close="close" /> -->
  </div>
</template>

<script>
import dialogBox from "~/dialog-box";
export default {
  name: "editRoleDialog",
  components: { dialogBox },
  props: { isShow: { required: true, type: Boolean, default: false } },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("update:isShow", false);
    },
  },
};
</script>

<style scoped>
</style>