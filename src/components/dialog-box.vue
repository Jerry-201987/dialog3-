<template>
  <el-dialog
    class="dialog-box"
    :visible="dialogVisible"
    :width="width"
    v-bind="$attrs"
    :before-close="handleClose"
    @close="close"
  >
    <template #title>
      <div class="title">
        <i />
        <h3>{{ title }}</h3>
      </div>
    </template>
    <img v-if="level" class="tip-img" src="@/images/tip.png" />
    <!-- <template #footer> -->
    <slot name="content"/>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="close" :disabled="sureDisable"
        >确 定</el-button
      >
    </span>
    <!-- </template> -->
  </el-dialog>
</template>

<script>
export default {
  name: "dialogBox",
  inheritAttrs: false,
  props: {
    title: { type: String, default: "提示" },
    dialogVisible: { type: Boolean, default: false },
    sureDisable: { type: Boolean, default: false },
    width: { type: String, default: "500px" },
    level: { type: String, default: "false" },
  },
  data() {
    return {};
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？").then((_) => {
        done();
      });
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="less">
.dialog-box {
  // padding: 22px 0;
  // border-bottom: 21px solid #f2f3f6;
  .title {
    height: 20px;
    line-height: 20px;
    i {
      display: inline-block;
      height: 18px;
      width: 6px;
      background: #4a92fe;
      border-radius: 16px;
      vertical-align: top;
      margin-top: 1px;
      margin-left: 24px;
    }
    h3 {
      display: inline-block;
      font-size: 18px;
      line-height: 20px;
      color: #1f2329;
      margin-left: 8px;
    }
  }
  .tip-img {
    margin-top: 20px;
    width: 30px;
    height: 30px;
    text-align: center;
  }
  .dialog-footer {
    padding: 4px 0 30px 0;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
    // .el-button {
    //   width: 80px;
    //   font-size: 12px;
    //   height: 36px;
    //   line-height: 36px;
    //   padding: 0;
    //   border: 1px solid #409eff;
    // }
  }
}
</style>
