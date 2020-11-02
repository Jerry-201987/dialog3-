<template>
  <div :style="{ display: isShow ? 'block' : 'none' }">
    <h5>新增角色</h5>
    <dialog-box :dialogVisible="isShow" @close="close" />
  </div>
</template>

<script>
import dialogBox from "~/dialog-box";
export default {
  name: "addRoleDialog",
  components: { dialogBox },
  props: { isShow: { required: true, type: Boolean, default: false } },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit('update:isShow', false)
    }
  },
};
</script>

<style scoped>
</style>