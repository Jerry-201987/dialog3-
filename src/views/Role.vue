<template>
  <div>
    <el-button @click="addRole">新增角色</el-button>
    <el-button @click="editRole">修改角色</el-button>
    <add-role-dialog :isShow.sync="showAddDialog" />
    <edit-role-dialog :isShow.sync="showEditDialog" />
  </div>
</template>

<script>
import addRoleDialog from "./add-role-dialog";
import editRoleDialog from "./edit-role-dialog";
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
    };
  },
  methods: {
    addRole() {
      this.showAddDialog = true;
    },
    editRole() {
      this.showEditDialog = true;
    },
    // hideAddDialog() {
    //   this.showAddDialog = false;
    // },
    // hideEditDialog() {
    //   this.showEditDialog = false;
    // },
  },
};
</script>

<style scoped>
</style>