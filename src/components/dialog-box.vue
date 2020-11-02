<template>
  <el-dialog
    fullscreen
    title="提示"
    :visible="dialogVisible"
    width="30%"
    :before-close="handleClose"
    @close="close"
  >
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'dialogBox',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？").then((_) => {
        done();
      });
    },
    close() {
      this.$emit('close')
    }
  },
};
</script>

<style scoped>
</style>