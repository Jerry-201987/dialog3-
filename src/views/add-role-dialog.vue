import axios from 'axios'
import qs from 'qs'

const doLogin = () => {
  // const LOCATION = document.location
  // localStorage.clear()
  // top.window.location.href = `${LOCATION.protocol}//${LOCATION.host}/LEM/index/tologin.do?ts=${new Date().getTime()}`

  window.postMessage('goto-login', document.location.origin)
}

// 请求拦截器
axios.interceptors.request.use(
  config => {
    if (!navigator.onLine) {
      location.reload()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器即异常处理
axios.interceptors.response.use(
  response => {
    return new Promise(function(resolve) {
      if (response.request.responseURL === undefined) {
        response.request.responseURL = ''
      }
      if (response.data) {
        if (response.data['resultCode'] === '090001') {
          window.onbeforeunload = null
          doLogin()
        }
        if (response.config.url.indexOf('download') !== -1) {
          resolve(response)
        } else {
          resolve(response.data)
        }
      } else {
        resolve(response)
      }
    })
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 301:
          doLogin()
          break
        case 400:
          error.message = '错误请求'
          break
        case 401:
          error.message = '未授权，请重新登录'
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = '请求错误,未找到该资源'
          break
        case 405:
          error.message = '请求方法未允许'
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器端出错'
          break
        case 501:
          error.message = '网络未实现'
          break
        case 502:
          error.message = '网络错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网络超时'
          break
        case 505:
          error.message = 'http版本不支持该请求'
          break
        default:
          error.message = `连接错误${error.response.status}`
      }
    } else {
      try {
        error.message = '连接到服务器失败'
      } catch (error) {}
    }
    return Promise.resolve(error.response)
  }
)

const setDefaultHeaders = (resetStatus = false) => {
  if (resetStatus) {
    axios.defaults.headers = []
  }
  const token = (document.cookie.match(/csrf_token=(\w+)/) || [])[1]
  axios.defaults.timeout = 600000
  axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
  axios.defaults.headers['Content-Type'] = 'application/json; charset=utf-8'
  if (token) {
    axios.defaults.headers['X-CSRF-TOKEN'] = token
  }
}

setDefaultHeaders()

const get = function(options) {
  // console.log('options',options)
  return new Promise((resolve, reject) => {
    if(options['params']){
      axios({
        method: 'get',
        url: `${options.url}?${qs.stringify(options['params'])}`
      })
        .then(res => {
          resolve(res)
        })
        .catch(opt => {
          reject(opt)
        })
    }else{
       axios({
        method: 'get',
        url: options.url
      })
        .then(res => {
          resolve(res)
        })
        .catch(opt => {
          reject(opt)
        })
    }
  })
}
const getExcel = function(options) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: options.url,
      responseType: 'blob'
    })
      .then(res => {
        resolve(res)
      })
      .catch(res => {
        reject(res)
      })
  })
}

const post = function(options) {
  let headers = options.headers || { ...axios.defaults.headers }
  let responseType = axios.defaults.responseType
  const type = options.type
  if (
    headers['Content-Type'] ===
      'application/x-www-form-urlencoded;charset=UTF-8' ||
    type === 'OWS'
  ) {
    data = qs.stringify(options.params)
  } else if (headers['Content-Type'] === 'multipart/form-data;charset=UTF-8') {
    data = options.params
  } else {
    data = JSON.stringify(options.params)
  }

  if (options.type === 'DOWNLOAD') {
    responseType = 'blob'
  }

  if (options.type === 'LOCAL') {
    return get(options)
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      timeout: 60000,
      url: options.url,
      data,
      headers,
      responseType
    })
      .then(res => {
        resolve(res)
      })
      .catch(opt => {
        reject(opt)
      })
  })
}
export default {
  doLogin,
  post,
  get,
  getExcel
}
++++++++++++++++++++++++
<template>
  <div>
    <!-- <h5>新增角色</h5> -->
    <div :class="isShow?'el-icon-arrow-up':'el-icon-arrow-down'"></div>
    <dialog-box :dialogVisible="isShow" title="新增角色" width="1000px" @close="close">
      <template v-slot:content>
        <el-button @click="closeAddRole">关闭新增角色</el-button>
        <el-input v-model="email" placeholder="请输入邮箱"/>
        <el-button @click="emailChange">{{emails}}</el-button>
      </template>
    </dialog-box>
  </div>
</template>

<script>
import dialogBox from "~/dialog-box";
export default {
  name: "addRoleDialog",
  components: { dialogBox },
  props: { 
    isShow: { required: true, type: Boolean, default: false },
    details: { type: Object, default: ()=>{return {}} } 
    },
  data() {
    return {
      visible: false,
      email: '123@sina.cn',
      emails: ''
    };
  },
  methods: {
    close() {
      this.$emit("update:isShow", false);
      this.email = '123@sina.cn'
    },
    closeAddRole() {
      this.$emit("update:isShow", false);
      this.email = '123@sina.cn'
    },
    emailChange() {
      if (this.emails !== this.email) {
        this.emails = this.email
      } else {
        this.emails = '置空'
        this.email = ''
      }
    }
  },
  watch: {
    isShow() {
      this.visible = this.isShow
      if (this.visible) {
        this.emails = this.email
        // this.emails = this.details.email
    }
    }
  }
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
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
<template>
  <dialog-box title="修改密码"
              class="editDialog-eded0d"
              width="480px"
              :visible.sync="visible"
              :sure-disable="loading"
              @close="hideDialog"
              @submit="submit"
              @cancel="hideDialog">
    <el-form ref="eidtForm"
             v-loading="loading"
             class="edit-dialog-form"
             :rules="editRules"
             :model="editForms"
             label-width="90px">
      <el-form-item label="账户名称"
                    prop="username">
        <div style="text-align: left">
          {{ editForms.username }}
        </div>
      </el-form-item>
      <el-form-item label="当前密码"
                    prop="password">
        <el-input v-model="editForms.password"
                  type="password"
                  placeholder="请输入当前密码" />
      </el-form-item>
      <el-form-item label="新密码"
                    prop="newpassword">
        <el-input v-model="editForms.newpassword"
                  type="password"
                  placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item label="确认密码"
                    prop="rePassword">
        <el-input v-model="editForms.rePassword"
                  type="password"
                  placeholder="请确认密码" />
      </el-form-item>
    </el-form>
  </dialog-box>
</template>
<script>
import { checkStrongPassword } from '_utils/validate'
import { handleModifyAdminPwd } from '@/api/user-manage'
import DialogBox from '@/components/dialog-box'
export default {
  name: 'MopassDialog',
  components: { DialogBox },
  props: {
    isShow: {
      require: true,
      type: Boolean,
      default: false
    },
    details: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data() {
    const validatePass1 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (!checkStrongPassword(value)) {
        // callback(new Error('口令必须包含数字,大小写字母,特殊字符中的2种组合,且长度不低于8位'))
        callback(new Error('密码过于简单'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认密码'))
      } else if (value !== this.editForms.newpassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      loading: false,
      editForms: {
        username: '',
        password: '',
        newpassword: '',
        rePassword: ''
      },
      editRules: {
        // username: [{ required: true, message: '请输入账户名称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
        newpassword: [{ required: true, validator: validatePass1, trigger: 'blur' }],
        rePassword: [{ required: true, validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  watch: {
    isShow() {
      console.log(this.isShow)
      this.visible = this.isShow
      if (this.visible) {
        this.editForms = Object.assign(this.editForms, this.details)
      }
    }
  },

  methods: {
    hideDialog(data) {
      // 关闭弹窗
      this.visible = false
      this.$emit('hide', data)
      setTimeout(() => {
        // 重置value
        this.$refs.eidtForm.resetFields()
      }, 300)
    },
    // 点击确定
    submit() {
      this.$refs.eidtForm.validate(valid => {
        //  校验不通过
        if (!valid) return

        // 校验通过，提交保存
        this.loading = true
        // 提交修改
        handleModifyAdminPwd({
          oldPassword: this.editForms.password,
          newPassword: this.editForms.rePassword
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '密码修改成功!'
            })
            this.$emit('success')
            this.$router.replace({ name: 'login' })
          })
          .catch(({ code }) => {
            // 密码修改失败
            if (code === 'USER-800002') {
              this.$message.error('输入密码错误次数太多，请重新登录')
              this.$router.replace({ name: 'login' })
            } else if (code === 'PUB-600011') {
              this.$message.error('密码强度不够')
            } else if (code === 'PUB-800001') {
              this.$message.error('原密码不正确')
            } else if (code === 'USER_800007') {
              this.$message.error('密码不可以与用户名或者用户名的逆序相同')
            } else if (code === 'USER-800008') {
              this.$message.error('密码不可以与最近使用密码相同')
            } else if (code === 'USER_800006') {
              this.$message.error('修改密码过于频繁，请稍后再试')
            } else {
              this.$message({
                type: 'error',
                message: '密码修改失败!'
              })
            }
          })
          .finally(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>
<style lang="less">
.editDialog-eded0d {
  .el-dialog__footer {
    text-align: center;
  }
  .w_360 {
    width: 360px;
  }
  .edit-dialog-form {
    padding: 20px;
    .el-select {
      width: 100%;
    }
  }
}
</style>
