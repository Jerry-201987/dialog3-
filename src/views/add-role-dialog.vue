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
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
<template>
  <div class="weakpwds">
    <page-out class="box">
      <template v-slot:header>
        弱口令管理
      </template>
      <template v-slot:condition>
        <div class="search-box">
          <span class="search-label">
            弱口令名称
          </span>
          <el-input v-model.trim="listParams.weakpwd"
                    class="search-input"
                    maxlength="32" show-word-limit
                    @keyup.enter.native="searchEve"
                    clearable />
          <el-button type="primary"
                     class="search-button"
                     :disabled="loading"
                     @click="searchEve">
            查询
          </el-button>
          <el-button v-permission="['addweakpwd']"
                     type="primary"
                     class="add-button"
                     @click="addDialog = true">
            新增弱口令
          </el-button>
        </div>
      </template>
      <template v-slot:content>
        <div v-loading="loading"
             class="weakpwds-list">
          <table-config :columns="columns"
                        :data="listData"
                        :row-style="{height:'52px'}"
                        @delEve="delDialogShow" />
          <div class="page-handle">
            <el-pagination background
                           :current-page="listParams.pageIndex"
                           :page-sizes="[10, 20]"
                           :page-size="listParams.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totalCount"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange" />
          </div>
        </div>
      </template>
    </page-out>
    <dialog-box title="新增"
                :visible.sync="addDialog"
                :sure-disable="!addInput"
                @cancel="addDialog=false"
                @submit="addSubmitEve">
      <div class="add-content">
        <span>*</span>
        <span>弱口令名称</span>
        <el-input v-model.trim="addInput"
                  placeholder="请输入" />
      </div>
    </dialog-box>
    <message-box title="提示"
                 :visible.sync="delDialog"
                 :level="'warn'"
                 width="502px"
                 @confirm="delSubmitEve">
      <div class="del-content">
        <p>确定删除该弱口令？删除后将无法恢复。</p>
      </div>
    </message-box>
  </div>
</template>

<script>
import PageOut from '@/components/page-out'
import DialogBox from '@/components/dialog-box'
import MessageBox from '@/components/message-box'
import TableConfig from '@/components/table-config'
import scenes from './config'
import { getWeakpwds, delWeakpwds, addWeakpwds } from '@/api/weakpwd-manage'
export default {
  name: 'WeakpwdManage',
  components: {
    TableConfig,
    PageOut,
    DialogBox,
    MessageBox
  },
  data() {
    return {
      loading: true,
      delDialog: false,
      addDialog: false,
      columns: [],
      listData: [],
      addInput: '',
      listParams: {
        weakpwd: '',
        pageIndex: 1,
        pageSize: 10
      },
      totalCount: 0,
      delObj: null
    }
  },
  mounted() {
    this.columns = scenes.fields
    this.getData()
  },
  methods: {
    searchEve() {
      this.getData()
    },
    // 获取列表
    getData(flag = true) {
    // getData() {
      this.loading = true
      if (flag) this.listParams.pageIndex = 1
      getWeakpwds(this.listParams)
        .then(res => {
          this.loading = false
          res.data.map((item, idx) => {
            item.num = idx + 1
          })
          this.totalCount = res.total
          this.listData = res.data
        })
        .catch(e => {
          this.$message({
            message: '查询失败',
            type: 'error'
          })
          this.listParams.pageIndex = 1
          this.totalCount = 0
          this.loading = false
          this.listData = []
        })
    },
    // 分页size
    handleSizeChange(e) {
      this.listParams.pageSize = e
      this.getData()
    },
    // 页码
    handleCurrentChange(e) {
      this.listParams.pageIndex = e
      this.getData(false)
    },
    // 新增确定
    addSubmitEve() {
      addWeakpwds({ weakpwd: this.addInput })
        .then(res => {
          this.$message({
            message: '新增弱口令成功！',
            type: 'success'
          })
          this.addInput = ''
          this.getData()
          this.addDialog = false
        })
        .catch(() => {
          this.$message({
            message: '新增弱口令失败！',
            type: 'error'
          })
        })
    },
    delDialogShow(e) {
      this.delObj = e
      this.delDialog = true
    },
    // 删除确定
    delSubmitEve() {
      delWeakpwds({weakpwd:encodeURIComponent(this.delObj.weakpwd)})
        .then(res => {
          this.getData()
          this.$message({
            message: '删除弱口令成功！',
            type: 'success'
          })
          this.delDialog = false
        })
        .catch(() => {
          this.$message({
            message: '删除弱口令失败！',
            type: 'error'
          })
        })
    }
  }
}
</script>
<style lang="less" scoped>
.weakpwds {
  .search-box {
    .search-label {
      color: #606670;
    }
    .search-input {
      width: 290px;
      margin-left: 6px;
      vertical-align: middle;
      ::v-deep .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
      .el-input__suffix {
        margin-top: -2px;
      }
    }
    .search-button {
      margin-left: 16px;
      height: 36px;
      width: 80px;
      vertical-align: middle;
    }
    .add-button {
      float: right;
      height: 36px;
    }
  }
  .del-icon {
    font-size: 16px;
    padding: 0 0;
    border: 0;
    &:hover {
      color: #4a92fe;
    }
  }
  .add-content {
    padding: 24px 0;
    line-height: 36px;
    span:nth-child(1) {
      color: #ff7272;
      margin-right: 4px;
    }
    span:nth-child(2) {
      margin-right: 8px;
    }
    ::v-deep .el-input {
      width: 290px;
      .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }
  }
  .del-content {
    img {
      margin: 12px 0;
    }
    p {
      line-height: 50px;
      font-size: 18px;
    }
    margin-bottom: 12px;
  }
  .weakpwds-list {
    height: 100%;
  }
}
</style>
