
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
---------------------------------------------------------------------------------------------------------------
<template>
  <div class="usermenu">
    <img v-if="user.photo"
         class="usermenu-photo"
         :src="user.photo">
    <el-dropdown>
      <span class="el-dropdown-link">
        {{ user.username }}
        <i class="el-icon-arrow-down el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="modifyPwd">
          修改密码
        </el-dropdown-item>
        <el-dropdown-item @click.native="logout">
          注销
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码弹窗 -->
    <mopass-dialog :is-show="NOTICE_showMopassDialog"
                   :details="user"
                   @hide="NOTICE_hideMopassDialog"
                   @success="NOTICE_modSuccess" />
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import ModifyPwd from '@/utils/mixin/modify-pwd'

export default {
  name: 'UserMenu',
  mixins: [ModifyPwd],
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions(['doLogout']),
    logout() {
      this.doLogout()
        .then(() => {
          this.$router.push({ name: 'login' })
        })
        .catch(err => {
          console.log(err)
        })
    },
    modifyPwd() {
      this.NOTICE_showMopassDialog = true
    }
  }
}
</script>
<style lang="less" scoped>
.usermenu {
  &-photo {
    height: 30px;
    width: 30px;
  }
}
</style>
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 角色维护页面
<template>
  <div class="role-maintenance-wrap">
    <page-out class="role-maintenance-layout">
      <template v-slot:header>
        {{ $route.meta.title }}
      </template>
      <template v-slot:condition>
        <div class="role-header">
          <span class="el-icon-user" />
          <span class="text">角色信息</span>
          <span
            class="el-icon-arrow-up"
            @click="isShowRoleInfo = !isShowRoleInfo"
          />
        </div>
        <div v-show="isShowRoleInfo" class="role-maintenance-form-wrap">
          <el-form class="role-maintenance-form">
            <el-form-item label="角色名称" required>
              <el-input
                v-model.trim="roleModel.roleName"
                clearable
                maxlength="30"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item label="角色级别" required>
              <el-select
                v-model.trim="roleModel.roleLevelLabel.label"
                placeholder="请输入"
                @visible-change="changeRoleLevel($event,roleModel.roleLevelLabel.label)"
              >
                <el-option
                  v-for="item in roleLevelList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input
                v-model.trim="roleModel.roleDesc"
                maxlength="50"
                placeholder="请输入"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template v-slot:content>
        <div class="role-rights-header">
          <span class="el-icon-setting" />
          <span class="text">权限配置</span>
        </div>
        <div class="role-rights-tree-wrap">
          <el-tree
            ref="tree"
            :data="privilegesList"
            node-key="privilegeId"
            :default-checked-keys="defaultCheckedKeys"
            :expand-on-click-node="false"
            :indent="0"
            :props="defaultProps"
            class="rights-tree"
            default-expand-all
            icon-class="el-icon-circle-plus-outline"
            show-checkbox
          />
        </div>
        <div class="operation-wrap">
          <div class="btn-wrap">
            <el-button class="ssf-button" type="primary" @click="save">
              确定
            </el-button>
            <el-button class="ssf-button" @click="reset">
              重置
            </el-button>
            <el-button class="ssf-button" @click="goToBack">
              返回
            </el-button>
          </div>
        </div>
      </template>
    </page-out>
  </div>
</template>
<script>
import PageOut from '@/components/page-out'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default {
  components: {
    PageOut
  },
  data() {
    let roleName = ''
    let roleLevel = ''
    let roleDesc = ''
    let roleId = ''
    let roleLevelLabel = ''
    if (this.$route.name === 'roleEdit') {
      let roleDetail = sessionStorage.getItem('roleDetail')
      if (roleDetail) {
        roleDetail = JSON.parse(roleDetail)
        roleName = roleDetail.roleName
        roleLevel = roleDetail.roleLevel
        roleDesc = roleDetail.roleDesc
        roleId = roleDetail.roleId
        roleLevelLabel = roleDetail.roleLevelLabel
      }
    }
    return {
      defaultProps: {
        children: 'children',
        label: 'privilegeName'
      },
      roleModel: {
        roleId,
        roleName,
        roleLevel,
        roleDesc,
        roleLevelLabel
      },
      isShowRoleInfo: true,
      changeRoleLevelValue: 0
    }
  },
  computed: {
    // 获取角色总对象数据
    ...mapState('systemManage', ['roleOption']),
    ...mapGetters('systemManage', ['computedRoleLevelList']),
    ...mapGetters(['user']),
    // 角色级别数据集合
    roleLevelList() {
      let _roleLevelList = []
      if (
        this.$store.state.auth &&
        this.$store.state.auth.user &&
        this.$store.state.auth.user.userLevel
      ) {
        const { userLevel } = this.$store.state.auth.user
        _roleLevelList = this.computedRoleLevelList(userLevel)
      }
      return _roleLevelList
    },
    // 获取角色权限数据

    privilegesList() {
      let _privilegesList = []
      if (
        this.roleOption &&
        this.roleOption.privilegesList &&
        this.roleOption.privilegesList.length
      ) {
        if (this.roleModel.roleLevelLabel.label) {
          let roleLevel = this.roleModel.roleLevelLabel.value
          if (this.changeRoleLevelValue > 0) {
            roleLevel = this.roleModel.roleLevelLabel.label
          }
          _privilegesList = this.roleOption.privilegesList.filter(
            i => {
              return i.privilegeLevel >= roleLevel
            }
          )
        }
        // 将线性数据转换成树形数据
        _privilegesList = this.lineToChildren(_privilegesList)
      }
      return _privilegesList
    },
    // 初始化用户权限数据
    defaultCheckedKeys() {
      let _defaultCheckedKeys = []
      if (
        this.roleOption &&
        this.roleOption.rolePrivileges &&
        this.roleOption.rolePrivileges.length
      ) {
        _defaultCheckedKeys = this.roleOption.rolePrivileges.map(
          i => i.privilegeId
        )
        this.roleOption.privilegesList.forEach(node => {
          if (node.parentId) {
            _defaultCheckedKeys = _defaultCheckedKeys.filter(item => item !== node.parentId)
          }
        })
      }
      return _defaultCheckedKeys
    }
  },
  async created() {
    // 初始化【角色级别】选择值
    const maxPrivilegeLevel = this.user.userLevel + 1
    if (this.roleLevelList.length && this.$route.name === 'roleAdd') { this.roleModel.roleLevel = maxPrivilegeLevel }
    const params = {
      level: maxPrivilegeLevel
    }
    // 获取可用的权限清单数据
    await this.getPrivilegesList(params)
    if (this.$route.name === 'roleEdit') {
      await this.retrieveRoleDetail(this.roleModel.roleId)
    }
  },
  beforeDestroy() {
    // 清空【权限配置】选择项
    this.setRoleOption({ rolePrivileges: [] })
  },
  methods: {
    ...mapActions('systemManage', [
      'getPrivilegesList',
      'getRoleDetail',
      'addRole',
      'editRole'
    ]),
    ...mapMutations('systemManage', ['setRoleOption', 'setRoleModel']),
    // 【确定】点击事件
    async save() {
      // const regRoleName = /(?![+\-\s])([ .,'”“【】（）’‘：？，·。《》、；……￥！%\-_/0-9a-zA-Z\u4e00-\u9fa5])+/
      const regRoleName = /[^0-9a-zA-Z\u4e00-\u9fa5]/
      if (regRoleName.test(this.roleModel.roleName)) {
        return this.$message({
          type: 'error',
          message: '角色名称不能包含非法字符'
        })
      }
      const regRoleDesc = /[^0-9a-zA-Z\u4e00-\u9fa5]/
      if (regRoleDesc.test(this.roleModel.roleDesc)) {
        return this.$message({
          type: 'error',
          message: '角色描述不能包含非法字符'
        })
      }
      // 确保【角色名称】为必填项
      if (!this.roleModel.roleName) {
        this.$message({
          type: 'error',
          message: '角色名称不能为空'
        })
        return
      }
      // 如果需要传入父ID 加入两个参数 const selectedNodes = this.$refs.tree.getCheckedNodes(false, true)
      const selectedNodes = this.$refs.tree.getCheckedNodes(false, true)
      const pvgList = selectedNodes.map(item => item.privilegeId)
      // 确保【角色名称】为必填项
      if (pvgList == null || pvgList.length < 1) {
        this.$message({
          type: 'error',
          message: '至少选择一项权限'
        })
        return
      }
      const params = {
        roleName: this.roleModel.roleName,
        roleLevel: this.roleModel.roleLevel,
        roleDesc: this.roleModel.roleDesc
      }
      if (pvgList.length) {
        Object.assign(params, { pvgList })
      }
      if (this.$route.name === 'roleAdd') {
        (await this.addRole(params)) && this.goToBack()
      }
      if (this.$route.name === 'roleEdit') {
        Object.assign(params, { roleId: this.roleModel.roleId });
        (await this.editRole(params)) && this.goToBack()
      }
    },

    // 返回 点击事件
    goToBack() {
      // 跳转到对应菜单显示页面
      const { activeMenu } = this.$route.meta
      if (activeMenu) {
        this.$router.replace({ name: activeMenu })
      } else {
        this.$router.go(-1)
      }
    },
    // 检查角色详情数据
    retrieveRoleDetail(roleId) {
      this.getRoleDetail(roleId)
    },
    // 【重置】点击事件
    reset() {
      this.$refs.tree.setCheckedKeys([])
    },
    //  将线性数据转换成树形数据
    lineToChildren(flatData, rootID = '-1') {
      flatData = JSON.parse(JSON.stringify(flatData))
      return flatData.filter(father => {
        const branchArr = flatData.filter(child => {
          return father.privilegeId === child.parentId
        })
        if (branchArr.length > 0) {
          father.children = branchArr
        }
        return father.parentId === rootID
      })
    },
    // 选中值发生变化时
    changeRoleLevel(callback, cv) {
      if (!callback) {
        this.changeRoleLevelValue = 1
        this.roleModel.roleLevel = cv
      }
    }
  }
}
</script>
<style lang="less" scoped>
.role-maintenance-wrap {
  width: 100%;
  height: 100%;
  color: #1f2329;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #ffffff;

  .role-maintenance-layout {
    ::v-deep .body {
      overflow: hidden;
      box-sizing: border-box;

      .condition {
        .role-header {
          height: 1.1458333333333333vw;
          line-height: 1.1458333333333333vw;
          font-size: 0.8333333333333334vw;
          display: flex;
          align-items: center;

          .text {
            user-select: none;
          }

          span {
            &:not(:first-child) {
              margin-left: 10px;
            }
          }

          .el-icon-user,
          .el-icon-arrow-up {
            color: #379cf8;
          }

          .el-icon-arrow-up {
            cursor: pointer;
          }
        }

        .role-maintenance-form-wrap {
          margin-top: 1.0416666666666665vw;
          padding: 0 1.0416666666666665vw;
          height: 2.083333333333333vw;

          .role-maintenance-form {
            height: 2.083333333333333vw;
            box-sizing: border-box;
            overflow: hidden;
            display: flex;
            align-items: center;
            margin-right: 1.0416666666666665vw;

            .el-form-item {
              height: 100%;
              display: flex;
              align-items: center;
              margin-bottom: 0;

              .el-form-item__label {
                font-size: 0.7291666666666666vw;
                line-height: 1.875vw;
              }

              .el-form-item__content {
                line-height: 1;

                .el-input {
                  .el-input__inner {
                    height: 1.875vw;
                    width: 15.104166666666666vw;
                    background-color: #ffffff;
                    border-radius: 3px;
                    border: solid 1px #dee0e4;
                    font-size: 0.8333333333333334vw;
                    line-height: 1.875vw;
                  }

                  .el-input__suffix {
                    line-height: 1.875vw;

                    .el-input__suffix-inner {
                      display: inline-block;

                      .el-input__icon {
                        display: inline-block;
                        line-height: 1.875vw;
                      }
                    }
                  }
                }
              }

              &:not(:first-child) {
                margin-left: 1.0416666666666665vw;
              }

              &:last-child {
                flex: 1;

                .el-form-item__content {
                  flex: 1 !important;

                  .el-input {
                    .el-input__inner {
                      width: 100%;
                    }
                  }
                }
              }
            }
          }
        }
      }

      .content {
        height: calc(100% - 4vw);
        overflow: hidden;
        box-sizing: border-box;
      }

      .role-rights-header {
        height: 1.09375vw;
        line-height: 1.09375vw;
        font-size: 0.8333333333333334vw;

        .el-icon-setting {
          color: #379cf8;
        }

        .text {
          margin-left: 10px;
        }
      }

      .role-rights-tree-wrap {
        width: 100%;
        max-height: calc(100% - 5.5vw);
        padding: 0.5vw 0;
        overflow: scroll;
      }

      .operation-wrap {
        width: 100%;
        height: 3vw;
        text-align: left;
        padding-left: 4.6875vw;
        box-sizing: border-box;
        display: flex;
        align-items: center;

        .btn-wrap {
          display: flex;
        }
      }
    }
  }
}
</style>
<style lang="less">
.ssf-button.el-button {
  display: inline-block;
  height: 1.875vw;
  line-height: 1;
  // background-color: #4a92fe;
  border-radius: 3px;
  display: flex;
  align-items: center;
}

.rights-tree {
  max-height: 31.25vw;

  .el-tree-node {
    position: relative;
    padding-left: 16px; // 缩进量
  }

  .el-tree-node__children {
    padding-left: 16px; // 缩进量
  }

  // 竖线
  .el-tree-node::before {
    content: "";
    height: 100%;
    width: 1px;
    position: absolute;
    left: -3px;
    top: -18px;
    border-width: 1px;
    border-left: 1px dashed #52627c;
  }

  // 当前层最后一个节点的竖线高度固定
  .el-tree-node:last-child::before {
    height: 38px; // 可以自己调节到合适数值
  }

  // 横线
  .el-tree-node::after {
    content: "";
    width: 24px;
    height: 20px;
    position: absolute;
    left: -3px;
    top: 20px;
    border-width: 1px;
    border-top: 1px dashed #52627c;
  }

  // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
  & > .el-tree-node::after {
    border-top: none;
  }

  & > .el-tree-node::before {
    border-left: none;
  }

  // 展开关闭的icon
  .el-tree-node__expand-icon {
    font-size: 0.8333333333333334vw;
    // 叶子节点（无子节点）
    &.expanded {
      transform: rotateZ(180deg);

      &::before {
        content: "\e722";
      }
    }

    &.is-leaf {
      color: transparent;
      // display: none; // 也可以去掉
    }
  }

  .expanded.el-tree-node__expand-icon.el-icon-remove-outline {
    transform: rotateZ(180deg);
  }

  .el-tree-node__content {
    height: 40px;
  }

  .have-rights-list {
    .node-name-text {
      display: inline-block;
      padding-right: 15px;
      text-align: left;
    }
  }

  .rights-action-wrap {
    margin-left: 6px;

    .rights-action-item {
      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
}
</style>
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
<template>
  <div v-loading="isLoading" class="role-manage">
    <page-out>
      <template v-slot:header>角色管理</template>
      <template v-slot:condition>
        <div class="search-box">
          <span class="search-label">角色名称</span>
          <el-input class="search-input" v-model.trim="roleModel.roleName" maxlength="128" show-word-limit clearable placeholder="请输入角色名称" @keyup.enter.native="searchRole"/>
            <el-button class="search-button" :disabled="loading" type="primary" @click="searchRole">
              查询
            </el-button>
            <el-button v-permission="['addrole']" class="add-button" type="primary" @click="roleAddAction">
              新增角色
            </el-button>
        </div>
      </template>
      <template v-slot:content>
        <div v-loading="loading" class="user-list">
          <table-config :columns="columns" :data="roleList" :row-style="{height:'52px'}" />
        </div>
        <div class="page-handle">
          <el-pagination
            :current-page="pageIndex"
            :page-size="pageSize"
            :page-sizes="[10, 20]"
            :total="total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="pageIndexChange"
            @size-change="pageSizeChange"
          />
        </div>
        <edit-role-dialog :isShow.sync="showEditDialog" @searchRole="searchRole"/>
        <role-maintenance :isShow.sync="showAddDialog" @searchRole="searchRole"/>
        <message-box
          :visible.sync="isShowDeleteConfirmDialog"
          level="error"
          title="提示"
          width="502px"
          @confirm="confirmDeleteHandler"
        >
        <div class="del-content">
          <p>确定删除{{currentRowData.roleName}}？角色删除后无法恢复！</p>
        </div>
        </message-box>
      </template>
    </page-out>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { qryRoleDetail } from '@/api/role-manage.js'
import PageOut from '@/components/page-out'
import TableConfig from '@/components/table-config'
import MessageBox from '@/components/message-box'
import RoleMaintenance from "./role-maintenance.vue";
import EditRoleDialog from "./edit-role-dialog.vue";
export default {
  name: 'RoleManage',
  components: {
    RoleMaintenance,
    EditRoleDialog,
    MessageBox,
    PageOut,
    TableConfig
  },
  data() {
    return {
      loading: false,
      isShowDeleteConfirmDialog: false, //  删除确认弹框显示信号
      showAddDialog: false,
      showEditDialog: false,
      pageIndex: 1,
      pageSize: 10,
      roleModel: {
        // 角色模型数据
        roleName: '',
        roleLevel: ''
      },
      currentRowData: {},
      columns: [
        {
          title: '序号',
          key: 'num',
          minWidth: '80',
          render: (h, params) => {
            return ++params.$index
          }
        },
        {
          title: '角色名称',
          key: 'roleName',
          minWidth: '90'
        },
        {
          title: '角色级别',
          key: 'roleLevel',
          minWidth: '90',
          render: (h, params) => {
            return (
              <div>{params.row.roleLevel}级</div>
            )
          }
        },
        {
          title: '更新者',
          key: 'updateUsername',
          minWidth: '90'
        },
        {
          title: '更新时间',
          key: 'updateTime',
          minWidth: '90'
        },
        {
          title: '操作',
          key: '',
          minWidth: '90',
          render: (h, params) => {
            return (
              <div class="table-operation">
                {params.row.roleLevel!==1?(
                  <i
                  class="table-icon table-operation-icon-edit hw-blue"
                  title="编辑角色"
                  on-click={()=>this.roleEdit(params.row)}
                  />
                  ):(
                  ""
                  )}
                {params.row.roleLevel!==1?(
                  <i
                  class="table-icon table-operation-icon-delete hw-blue"
                  title="删除角色"
                  on-click={()=>this.roleDel(params.row)}
                  />
                  ):(
                  ""
                  )}
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    ...mapActions('systemManage', ['getRoleList', 'deleteRole']),
    // 检索角色清单数据
    retrieveRoleList(flag = true) {
      if (flag) this.pageIndex = 1
      const params = {
        roleName: this.roleModel.roleName,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      this.getRoleList(params)
    },
    // 查询点击事件
    searchRole() {
      this.pageIndex = 1
      this.pageSize = 10
      this.retrieveRoleList()
    },
    // 新增角色 点击事件
    roleAddAction() {
      // 清空角色数据模型
      const roleModel = {
        privilegeId: '',
        privilegeName: '',
        privilegeLevel: ''
      }
      sessionStorage.setItem('roleDetail', JSON.stringify(roleModel))
      this.showAddDialog = true;
    },
    // 【编辑】角色
    async roleEdit(item) {
      // 将角色详情入写浏览器缓存
      const res = await qryRoleDetail(item.roleId)
      if (res && res.code === 'PUB-000000') {
        sessionStorage.setItem('roleDetail', JSON.stringify(res.data))
        this.showEditDialog = true;
        this.currentRowData = item
      } else {
      }
    },
    // 预删除角色动作
    roleDel(item) {
      Object.assign(this.roleModel, { roleId: item.roleId })
      this.isShowDeleteConfirmDialog = true
      this.currentRowData = item
    },
    // 确认删除
    async confirmDeleteHandler() {
      const params = {
        roleId: this.roleModel.roleId,
        isDelRef: '0'
      }
      this.isShowDeleteConfirmDialog = false
      await this.deleteRole(params)
      this.searchRole()
    },
    // 页容量改变事件
    pageSizeChange(size) {
      this.pageSize = size
      this.retrieveRoleList()
    },
    // 页码改变事件
    pageIndexChange(index) {
      this.pageIndex = index
      this.retrieveRoleList(false)
    },
  },
  created() {
    // 检索列表
    this.retrieveRoleList()
  },
  computed: {
    // 获取角色总对象数据
    ...mapState('systemManage', ['roleOption', 'isLoading']),
    // 角色列表数据
    roleList() {
      let _roleList = []
      if (this.roleOption.roleList && this.roleOption.roleList.length) {
        _roleList = this.roleOption.roleList
      }
      return _roleList
    },
    // 角色级别数据集合
    roleLevelList() {
      let _roleLevelList = []
      if (this.roleOption.roleLevelList && this.roleOption.roleLevelList.length) {
        _roleLevelList = this.roleOption.roleLevelList
      }
      return _roleLevelList
    },
    // 角色总条目数
    total() {
      let numT = 0
      numT = this.roleOption.total
      return numT
    }
  }
}
</script>
<style lang="less" scoped>
.role-manage {
  .search-box {
    .search-label {
      color: #606670;
    }
    .search-input {
      width: 200px;
      margin-left: 6px;
      vertical-align: middle;
      .el-input__suffix {
        margin-top: -2px;
      }
    }
    ::v-deep .el-input__inner {
      height: 36px;
      line-height: 36px;
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
    .hw-blue {
    color: #4a92fe;
  }
  .user-list {
    height: 100%;
  }

  ::v-deep .el-table {
    .status {
      line-height: 20px;
      i {
        font-style: initial;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-left: 5px;
      }
      &.success {
        i {
          background-color: rgb(103, 220, 161);
        }
      }
      &.error {
        i {
          background-color: rgba(red, 0.8);
        }
      }
    }
    .roleName {
      &:not(:last-child) {
        margin-right: 5px;
      }
      i {
        margin: 0 2px;
        font-style: initial;
      }
    }
    .table-operation {
      display: flex;
      align-items: center;
    }
    .table-operation-icon {
      cursor: pointer;
      &:not(:last-child) {
        margin-right: 8px;
      }
    }
    .table-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      color: #409eff;
      background-size: contain;
      cursor: pointer;
      background-repeat: no-repeat;
      &:not(:last-child) {
        margin-right: 8px;
      }
      &.table-operation-icon-edit {
        background-image: url("../../../assets/images/icons/icon-edit.png");
      }
      &.table-operation-icon-delete {
        background-image: url("../../../assets/images/icons/icon-delete.png");
      }
      &.table-operation-icon-unlock {
        background-image: url("../../../assets/images/icons/icon-unlock.png");
      }
      &.table-operation-icon-lock {
        background-image: url("../../../assets/images/icons/icon-lock.png");
      }
      &.table-operation-icon-reset {
        background-image: url("../../../assets/images/icons/icon-reset.png");
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
}
</style>
