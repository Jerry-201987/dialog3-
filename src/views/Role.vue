<template>
  <div>
    <el-button @click="addRole">新增角色</el-button>
    <el-button @click="editRole">修改角色</el-button>
    <el-button @click="getList">获取列表</el-button>
    <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
    <add-role-dialog :isShow.sync="showAddDialog" />
    <edit-role-dialog :isShow.sync="showEditDialog" />
    <!-- <div v-for="(item,index) in list" :key="index">{{item.name}}--{{item.nickname}}--{{item.yearName}}</div> -->
    <el-table :data="list">
      <!-- <el-table-column :prop="item.prop" :label="item.label"  v-for="(item,index) in list" :key="index"></el-table-column> -->
      <!-- <el-table-column prop="nickname" label="庙号"></el-table-column>
      <el-table-column prop="yearName" label="年号"></el-table-column> -->
      <el-table-column prop="size" label="尺码"></el-table-column>
      <el-table-column prop="basicType" label="基本型号"></el-table-column>
      <el-table-column prop="waistline" label="腰围"></el-table-column>
      <el-table-column prop="outseam" label="裤长"></el-table-column>
      <el-table-column prop="hipline" label="臀围"></el-table-column>
      <el-table-column prop="bottoms" label="脚口"></el-table-column>
    </el-table>
    <el-tree
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
  </div>
</template>

<script>
import addRoleDialog from "./add-role-dialog";
import editRoleDialog from "./edit-role-dialog";
import { getList,showSetRightDialog } from '../api/role/role'
export default {
  name: "Role",
  components: {
    addRoleDialog,
    editRoleDialog,
  },
  data() {
    return {
      showAddDialog: false,
      showEditDialog: false,
      list: [
        // {prop:'name',label:'姓名'},
        // {prop:'size',label:'尺码'},
        // {prop:'basicType',label:'基本型号'},
        // {prop:'waistline',label:'腰围'},
        // {prop:'outseam',label:'裤长'},
        // {prop:'hipline',label:'臀围'},
        // {prop:'bottoms',label:'脚口'},
        ],
      flag: true
    };
  },
  methods: {
    addRole() {
      this.showAddDialog = true;
    },
    editRole() {
      this.showEditDialog = true;
    },
    async getList() {
      const { data: res } = await getList()
      this.list = res.data   
    },
     // 分配权限
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取角色的所有权限
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }
      //   获取权限树
      this.rightsList = res.data
      //   console.log(res)
      //   递归获取三级节点的id
      this.getLeafkeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },
    // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    getLeafkeys (node, arr) {
      // 没有children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafkeys(item, arr))
    },
    // 权限对话框关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    }
  },
};
</script>

<style scoped>
</style>
