<template>
  <div>
    <div class="btn-wrap">
      <el-button @click="addRole">新增角色</el-button>
      <el-button @click="editRole">修改角色</el-button>
      <el-button @click="getList">获取列表</el-button>
      <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog">分配权限</el-button>
      <el-button @click="save">确定</el-button>
    </div>
    <!-- <template v-if="showAddDialog"> -->
    <add-role-dialog :isShow.sync="showAddDialog" />
    <!-- </template> -->
    <edit-role-dialog :isShow.sync="showEditDialog" />
    <p>FullName:{{lastname+'666'+nicknameQ}}</p>
    <p>
      FirstName:
      <input type="text" v-model="nicknameQ" />
    </p>
    <p>{{obj.a}}</p>
    <input type="text" v-model="obj.a" />
    <p>{{obj.b}}</p>
    <input type="text" v-model="obj.b" />
    <button @click="testClick" ref="aa">{{testMsg}}</button>
    <el-tree
      :data="rightsList"
      :props="treeProps"
      ref="tree"
      show-checkbox
      node-key="objectId"
      default-expand-all
      @check="checkboxSelect"
    ></el-tree>
    <el-input class="elIpt" v-model="obj.username" @keyup.enter.native="addInformation" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import addRoleDialog from "./add-role-dialog";
import editRoleDialog from "./edit-role-dialog";
import { getList, showSetRightDialog } from "../api/role/role";
export default {
  computed: {
    ...mapState(["nickname", "lastname", "maxLength"])
  },
  watch: {
    lastname: {
      handler(newVal, oldVal) {
        this.nicknameQ = newVal;
      }
    },
    // lastname(newVal,oldVal){
    //   this.nicknameQ = newVal
    // },
    obj: {
      handler(newVal, oldVal) {
        // if(newVal.obj||newVal.obj!=oldVal.obj){
        //   console.log(222);
        // }else{
        console.log(333);
        // }
      },
      immediate: true,
      deep: true
    },
    "obj.b"(newVal, oldVal) {
      if (newVal || newVal != oldVal) {
        console.log(666);
      } else {
        console.log(888);
      }
    }
  },
  name: "Role",
  components: {
    addRoleDialog,
    editRoleDialog
  },
  data() {
    return {
      obj: {
        a: "奎因",
        b: "盖伦",
        username: ""
      },
      testMsg: "原始值",
      nicknameQ: "",
      showAddDialog: false,
      showEditDialog: false,
      list: [],
      rightsList: [],
      treeProps: { children: "children", label: "privilegeName" },
      allIdArr: []
    };
  },
  methods: {
    addInformation() {
      if (this.obj.username.length > this.maxLength) {
        this.$message({
          type: "error",
          message: "长度最大为5"
        });
      }
      if (this.obj.username === "苏打绿") {
        this.showSetRightDialog();
      }
    },
    addRole() {
      this.showAddDialog = true;
    },
    editRole() {
      this.showEditDialog = true;
    },
    close() {
      this.showAddDialog = false;
    },
    testClick() {
      let that = this;
      that.testMsg = "修改后的值";
      that.$nextTick(function() {
        that.testMsg = "后起之秀";
        // that.$refs.aa.innerHTML='后起之秀'
      });
    },
    async getList() {
      // const { data: res } = await getList();
      // this.list = res.data;
    },
    async showSetRightDialog() {
      //   const { data: res }  = await showSetRightDialog()
      let data = [
        {
          objectId: "-1",
          privilegeCode: "root",
          privilegeId: "-1",
          privilegeLevel: 5,
          privilegeName: "根节点",
          privilegeType: 1
        },
        {
          objectId: "10000002",
          parentId: "701",
          privilegeCode: "modmsgread",
          privilegeId: "10000002",
          privilegeLevel: 3,
          privilegeName: "修改消息状态",
          privilegeType: 2
        },
        {
          objectId: "10000001",
          parentId: "701",
          privilegeCode: "addfavoritecomps",
          privilegeId: "10000001",
          privilegeLevel: 3,
          privilegeName: "保存关联组件",
          privilegeType: 2
        },
        {
          objectId: "6010509",
          parentId: "60105",
          privilegeCode: "phm6010509",
          privilegeId: "6010509",
          privilegeLevel: 2,
          privilegeName: "测试用户管理",
          privilegeType: 1
        },
        {
          objectId: "6010508",
          parentId: "60105",
          privilegeCode: "phm6010508",
          privilegeId: "6010508",
          privilegeLevel: 2,
          privilegeName: "h5页面管理",
          privilegeType: 1
        },
        {
          objectId: "6010507",
          parentId: "60105",
          privilegeCode: "cimp6010507",
          privilegeId: "6010507",
          privilegeLevel: 2,
          privilegeName: "专题栏目查询",
          privilegeType: 1
        },
        {
          objectId: "6010506",
          parentId: "60105",
          privilegeCode: "phm6010506",
          privilegeId: "6010506",
          privilegeLevel: 2,
          privilegeName: "页面风格管理",
          privilegeType: 1
        },
        {
          objectId: "6010505",
          parentId: "60105",
          privilegeCode: "phm6010505",
          privilegeId: "6010505",
          privilegeLevel: 2,
          privilegeName: "碎片管理",
          privilegeType: 1
        },
        {
          objectId: "6010504",
          parentId: "60105",
          privilegeCode: "phm6010504",
          privilegeId: "6010504",
          privilegeLevel: 2,
          privilegeName: "碎片母版管理",
          privilegeType: 1
        },
        {
          objectId: "6010503",
          parentId: "60105",
          privilegeCode: "phm6010503",
          privilegeId: "6010503",
          privilegeLevel: 2,
          privilegeName: "脚本资源",
          privilegeType: 1
        },
        {
          objectId: "6010502",
          parentId: "60105",
          privilegeCode: "phm6010502",
          privilegeId: "6010502",
          privilegeLevel: 2,
          privilegeName: "样式资源",
          privilegeType: 1
        },
        {
          objectId: "6010501",
          parentId: "60105",
          privilegeCode: "phm6010501",
          privilegeId: "6010501",
          privilegeLevel: 2,
          privilegeName: "图片资源",
          privilegeType: 1
        },
        {
          objectId: "6010403",
          parentId: "60104",
          privilegeCode: "phm6010403",
          privilegeId: "6010403",
          privilegeLevel: 2,
          privilegeName: "专题管理",
          privilegeType: 1
        },
        {
          objectId: "6010402",
          parentId: "60104",
          privilegeCode: "phm6010402",
          privilegeId: "6010402",
          privilegeLevel: 2,
          privilegeName: "专题模板管理",
          privilegeType: 1
        },
        {
          objectId: "6010401",
          parentId: "60104",
          privilegeCode: "cimp6010401",
          privilegeId: "6010401",
          privilegeLevel: 2,
          privilegeName: "分类管理",
          privilegeType: 1
        },
        {
          objectId: "6010301",
          parentId: "60103",
          privilegeCode: "phm6010301",
          privilegeId: "6010301",
          privilegeLevel: 2,
          privilegeName: "桌面管理",
          privilegeType: 1
        },
        {
          objectId: "6010203",
          parentId: "60102",
          privilegeCode: "phm6010203",
          privilegeId: "6010203",
          privilegeLevel: 2,
          privilegeName: "桌面调度策略管理",
          privilegeType: 1
        },
        {
          objectId: "6010202",
          parentId: "60102",
          privilegeCode: "phm6010202",
          privilegeId: "6010202",
          privilegeLevel: 2,
          privilegeName: "用户分组管理",
          privilegeType: 1
        },
        {
          objectId: "6010201",
          parentId: "60102",
          privilegeCode: "phm6010201",
          privilegeId: "6010201",
          privilegeLevel: 2,
          privilegeName: "合作伙伴管理",
          privilegeType: 1
        },
        {
          objectId: "6010104",
          parentId: "60101",
          privilegeCode: "phm6010104",
          privilegeId: "6010104",
          privilegeLevel: 2,
          privilegeName: "桌面管理",
          privilegeType: 1
        },
        {
          objectId: "6010103",
          parentId: "60101",
          privilegeCode: "phm6010103",
          privilegeId: "6010103",
          privilegeLevel: 2,
          privilegeName: "页面管理",
          privilegeType: 1
        },
        {
          objectId: "6010102",
          parentId: "60101",
          privilegeCode: "phm6010102",
          privilegeId: "6010102",
          privilegeLevel: 2,
          privilegeName: "资源组管理",
          privilegeType: 1
        },
        {
          objectId: "6010101",
          parentId: "60101",
          privilegeCode: "phm6010101",
          privilegeId: "6010101",
          privilegeLevel: 2,
          privilegeName: "资源组模板管理",
          privilegeType: 1
        },
        {
          objectId: "5010101",
          parentId: "50101",
          privilegeCode: "vrs5010101",
          privilegeId: "5010101",
          privilegeLevel: 2,
          privilegeName: "营销活动管理",
          privilegeType: 1
        },
        {
          objectId: "4010203",
          parentId: "40102",
          privilegeCode: "vrs4010203",
          privilegeId: "4010203",
          privilegeLevel: 2,
          privilegeName: "产品审核管理",
          privilegeType: 1
        },
        {
          objectId: "4010202",
          parentId: "40102",
          privilegeCode: "vrs4010202",
          privilegeId: "4010202",
          privilegeLevel: 2,
          privilegeName: "产品互斥关系管理",
          privilegeType: 1
        },
        {
          objectId: "4010201",
          parentId: "40102",
          privilegeCode: "vrs4010201",
          privilegeId: "4010201",
          privilegeLevel: 2,
          privilegeName: "短信模板管理",
          privilegeType: 1
        },
        {
          objectId: "4010102",
          parentId: "40101",
          privilegeCode: "vrs4010102",
          privilegeId: "4010102",
          privilegeLevel: 2,
          privilegeName: "产品列表",
          privilegeType: 1
        },
        {
          objectId: "4010101",
          parentId: "40101",
          privilegeCode: "vrs4010101",
          privilegeId: "4010101",
          privilegeLevel: 2,
          privilegeName: "用户组管理",
          privilegeType: 1
        },
        {
          objectId: "3010402",
          parentId: "30104",
          privilegeCode: "cimp3010402",
          privilegeId: "3010402",
          privilegeLevel: 2,
          privilegeName: "业务包关联审核管理",
          privilegeType: 1
        },
        {
          objectId: "3010401",
          parentId: "30104",
          privilegeCode: "cimp3010401",
          privilegeId: "3010401",
          privilegeLevel: 2,
          privilegeName: "业务包管理",
          privilegeType: 1
        },
        {
          objectId: "3010302",
          parentId: "30103",
          privilegeCode: "cimp3010302",
          privilegeId: "3010302",
          privilegeLevel: 2,
          privilegeName: "分类关联审核管理",
          privilegeType: 1
        },
        {
          objectId: "3010301",
          parentId: "30103",
          privilegeCode: "cimp3010301",
          privilegeId: "3010301",
          privilegeLevel: 2,
          privilegeName: "分类管理",
          privilegeType: 1
        },
        {
          objectId: "3010201",
          parentId: "30102",
          privilegeCode: "cimp3010201",
          privilegeId: "3010201",
          privilegeLevel: 2,
          privilegeName: "点播管理",
          privilegeType: 1
        },
        {
          objectId: "3010101",
          parentId: "30101",
          privilegeCode: "cimp3010101",
          privilegeId: "3010101",
          privilegeLevel: 2,
          privilegeName: "点播审核管理",
          privilegeType: 1
        },
        {
          objectId: "2010402",
          parentId: "20104",
          privilegeCode: "cimp2010402",
          privilegeId: "2010402",
          privilegeLevel: 2,
          privilegeName: "节目单统计",
          privilegeType: 1
        },
        {
          objectId: "2010401",
          parentId: "20104",
          privilegeCode: "cimp2010401",
          privilegeId: "2010401",
          privilegeLevel: 2,
          privilegeName: "节目单审核",
          privilegeType: 1
        },
        {
          objectId: "2010302",
          parentId: "20103",
          privilegeCode: "cimp2010302",
          privilegeId: "2010302",
          privilegeLevel: 2,
          privilegeName: "固移融合关联确认管理",
          privilegeType: 1
        },
        {
          objectId: "2010301",
          parentId: "20103",
          privilegeCode: "cimp2010301",
          privilegeId: "2010301",
          privilegeLevel: 2,
          privilegeName: "重复内容确认管理",
          privilegeType: 1
        },
        {
          objectId: "2010202",
          parentId: "20102",
          privilegeCode: "cimp2010202",
          privilegeId: "2010202",
          privilegeLevel: 2,
          privilegeName: "发布任务",
          privilegeType: 1
        },
        {
          objectId: "2010201",
          parentId: "20102",
          privilegeCode: "cimp2010201",
          privilegeId: "2010201",
          privilegeLevel: 2,
          privilegeName: "点播管理",
          privilegeType: 1
        },
        {
          objectId: "2010104",
          parentId: "20101",
          privilegeCode: "cimp2010104",
          privilegeId: "2010104",
          privilegeLevel: 2,
          privilegeName: "剧集统计",
          privilegeType: 1
        },
        {
          objectId: "2010103",
          parentId: "20101",
          privilegeCode: "cimp2010103",
          privilegeId: "2010103",
          privilegeLevel: 2,
          privilegeName: "内容维护",
          privilegeType: 1
        },
        {
          objectId: "2010102",
          parentId: "20101",
          privilegeCode: "cimp2010102",
          privilegeId: "2010102",
          privilegeLevel: 2,
          privilegeName: "点播管理",
          privilegeType: 1
        },
        {
          objectId: "2010101",
          parentId: "20101",
          privilegeCode: "cimp2010101",
          privilegeId: "2010101",
          privilegeLevel: 2,
          privilegeName: "批量导入",
          privilegeType: 1
        },
        {
          objectId: "60105",
          parentId: "601",
          privilegeCode: "phm60105",
          privilegeId: "60105",
          privilegeLevel: 2,
          privilegeName: "H5页面编排",
          privilegeType: 1
        },
        {
          objectId: "60104",
          parentId: "601",
          privilegeCode: "phm60104",
          privilegeId: "60104",
          privilegeLevel: 2,
          privilegeName: "专题管理",
          privilegeType: 1
        },
        {
          objectId: "60103",
          parentId: "601",
          privilegeCode: "phm60103",
          privilegeId: "60103",
          privilegeLevel: 2,
          privilegeName: "发布审核",
          privilegeType: 1
        },
        {
          objectId: "60102",
          parentId: "601",
          privilegeCode: "phm60102",
          privilegeId: "60102",
          privilegeLevel: 2,
          privilegeName: "调度策略",
          privilegeType: 1
        },
        {
          objectId: "60101",
          parentId: "601",
          privilegeCode: "phm60101",
          privilegeId: "60101",
          privilegeLevel: 2,
          privilegeName: "桌面编排",
          privilegeType: 1
        },
        {
          objectId: "50101",
          parentId: "501",
          privilegeCode: "vrs50101",
          privilegeId: "50101",
          privilegeLevel: 2,
          privilegeName: "营销活动管理",
          privilegeType: 1
        },
        {
          objectId: "40102",
          parentId: "401",
          privilegeCode: "vrs40102",
          privilegeId: "40102",
          privilegeLevel: 2,
          privilegeName: "产品管理",
          privilegeType: 1
        },
        {
          objectId: "40101",
          parentId: "401",
          privilegeCode: "vrs40101",
          privilegeId: "40101",
          privilegeLevel: 2,
          privilegeName: "产品发布",
          privilegeType: 1
        },
        {
          objectId: "30104",
          parentId: "301",
          privilegeCode: "cimp30104",
          privilegeId: "30104",
          privilegeLevel: 2,
          privilegeName: "业务包编排",
          privilegeType: 1
        },
        {
          objectId: "30103",
          parentId: "301",
          privilegeCode: "cimp30103",
          privilegeId: "30103",
          privilegeLevel: 2,
          privilegeName: "栏目编排",
          privilegeType: 1
        },
        {
          objectId: "30102",
          parentId: "301",
          privilegeCode: "cimp30102",
          privilegeId: "30102",
          privilegeLevel: 2,
          privilegeName: "内容编目",
          privilegeType: 1
        },
        {
          objectId: "30101",
          parentId: "301",
          privilegeCode: "cimp30101",
          privilegeId: "30101",
          privilegeLevel: 2,
          privilegeName: "上架审核",
          privilegeType: 1
        },
        {
          objectId: "20104",
          parentId: "201",
          privilegeCode: "cimp20104",
          privilegeId: "20104",
          privilegeLevel: 2,
          privilegeName: "直播管理",
          privilegeType: 1
        },
        {
          objectId: "20103",
          parentId: "201",
          privilegeCode: "cimp20103",
          privilegeId: "20103",
          privilegeLevel: 2,
          privilegeName: "去重&关联审核",
          privilegeType: 1
        },
        {
          objectId: "20102",
          parentId: "201",
          privilegeCode: "cimp20102",
          privilegeId: "20102",
          privilegeLevel: 2,
          privilegeName: "播控审核",
          privilegeType: 1
        },
        {
          objectId: "20101",
          parentId: "201",
          privilegeCode: "cimp20101",
          privilegeId: "20101",
          privilegeLevel: 2,
          privilegeName: "内容注入&质审",
          privilegeType: 1
        },
        {
          objectId: "10107",
          parentId: "101",
          privilegeCode: "msgmgmt",
          privilegeId: "10107",
          privilegeLevel: 2,
          privilegeName: "消息管理",
          privilegeType: 1
        },
        {
          objectId: "10106",
          parentId: "101",
          privilegeCode: "noticemgmt",
          privilegeId: "10106",
          privilegeLevel: 2,
          privilegeName: "公告管理",
          privilegeType: 1
        },
        {
          objectId: "901",
          parentId: "-1",
          privilegeCode: "uc801",
          privilegeId: "901",
          privilegeLevel: 2,
          privilegeName: "运营知识库",
          privilegeType: 1
        },
        {
          objectId: "801",
          parentId: "-1",
          privilegeCode: "irs801",
          privilegeId: "801",
          privilegeLevel: 2,
          privilegeName: "智能推荐",
          privilegeType: 1
        },
        {
          objectId: "701",
          parentId: "-1",
          privilegeCode: "docworkbench",
          privilegeId: "701",
          privilegeLevel: 2,
          privilegeName: "工作台",
          privilegeType: 1
        },
        {
          objectId: "601",
          parentId: "-1",
          privilegeCode: "phm601",
          privilegeId: "601",
          privilegeLevel: 2,
          privilegeName: "页面管理",
          privilegeType: 1
        },
        {
          objectId: "501",
          parentId: "-1",
          privilegeCode: "vrs501",
          privilegeId: "501",
          privilegeLevel: 2,
          privilegeName: "营销活动管理",
          privilegeType: 1
        },
        {
          objectId: "401",
          parentId: "-1",
          privilegeCode: "vrs401",
          privilegeId: "401",
          privilegeLevel: 2,
          privilegeName: "产品运营",
          privilegeType: 1
        },
        {
          objectId: "301",
          parentId: "-1",
          privilegeCode: "cimp301",
          privilegeId: "301",
          privilegeLevel: 2,
          privilegeName: "内容运营",
          privilegeType: 1
        },
        {
          objectId: "201",
          parentId: "-1",
          privilegeCode: "cimp201",
          privilegeId: "201",
          privilegeLevel: 2,
          privilegeName: "内容管理",
          privilegeType: 1
        },
        {
          objectId: "10105",
          parentId: "101",
          privilegeCode: "apiauthmgmt",
          privilegeId: "10105",
          privilegeLevel: 2,
          privilegeName: "API认证凭据管理",
          privilegeType: 1
        },
        {
          objectId: "10104",
          parentId: "101",
          privilegeCode: "weakpwdmgmt",
          privilegeId: "10104",
          privilegeLevel: 2,
          privilegeName: "弱口令管理",
          privilegeType: 1
        },
        {
          objectId: "removeloginlimit",
          parentId: "10101",
          privilegeCode: "removeloginlimit",
          privilegeId: "1010109",
          privilegeLevel: 2,
          privilegeName: "解除用户登录延迟限制",
          privilegeType: 2
        },
        {
          objectId: "resetpwd",
          parentId: "10101",
          privilegeCode: "resetpwd",
          privilegeId: "1010108",
          privilegeLevel: 2,
          privilegeName: "重置密码",
          privilegeType: 2
        },
        {
          objectId: "moduser",
          parentId: "10101",
          privilegeCode: "moduser",
          privilegeId: "1010103",
          privilegeLevel: 2,
          privilegeName: "修改用户",
          privilegeType: 2
        },
        {
          objectId: "adduser",
          parentId: "10101",
          privilegeCode: "adduser",
          privilegeId: "1010102",
          privilegeLevel: 2,
          privilegeName: "新增用户",
          privilegeType: 2
        },
        {
          objectId: "viewuser",
          parentId: "10101",
          privilegeCode: "viewuser",
          privilegeId: "1010101",
          privilegeLevel: 2,
          privilegeName: "查看用户",
          privilegeType: 2
        },
        {
          objectId: "10101",
          parentId: "101",
          privilegeCode: "usermgmt",
          privilegeId: "10101",
          privilegeLevel: 2,
          privilegeName: "用户管理",
          privilegeType: 1
        },
        {
          objectId: "101",
          parentId: "-1",
          privilegeCode: "sysmgmt",
          privilegeId: "101",
          privilegeLevel: 2,
          privilegeName: "系统管理",
          privilegeType: 1
        },
        {
          objectId: "delpool",
          parentId: "8010401",
          privilegeCode: "delpool",
          privilegeId: "801040105",
          privilegeLevel: 3,
          privilegeName: "删除片池",
          privilegeType: 2
        },
        {
          objectId: "exportpool",
          parentId: "8010401",
          privilegeCode: "exportpool",
          privilegeId: "801040104",
          privilegeLevel: 3,
          privilegeName: "导出片池",
          privilegeType: 2
        },
        {
          objectId: "updatepool",
          parentId: "8010401",
          privilegeCode: "updatepool",
          privilegeId: "801040103",
          privilegeLevel: 3,
          privilegeName: "修改片池",
          privilegeType: 2
        },
        {
          objectId: "addpool",
          parentId: "8010401",
          privilegeCode: "addpool",
          privilegeId: "801040102",
          privilegeLevel: 3,
          privilegeName: "新增片池",
          privilegeType: 2
        },
        {
          objectId: "qrypool",
          parentId: "8010401",
          privilegeCode: "qrypool",
          privilegeId: "801040101",
          privilegeLevel: 3,
          privilegeName: "查询片池",
          privilegeType: 2
        },
        {
          objectId: "delusergroup",
          parentId: "8010301",
          privilegeCode: "delusergroup",
          privilegeId: "801030104",
          privilegeLevel: 3,
          privilegeName: "删除用户群",
          privilegeType: 2
        },
        {
          objectId: "8010401",
          parentId: "80104",
          privilegeCode: "irs8010401",
          privilegeId: "8010401",
          privilegeLevel: 2,
          privilegeName: "片池管理",
          privilegeType: 1
        },
        {
          objectId: "exportusergroup",
          parentId: "8010301",
          privilegeCode: "exportusergroup",
          privilegeId: "801030105",
          privilegeLevel: 3,
          privilegeName: "导出用户群",
          privilegeType: 2
        },
        {
          objectId: "10000003",
          parentId: "701",
          privilegeCode: "modnoticeread",
          privilegeId: "10000003",
          privilegeLevel: 3,
          privilegeName: "修改公告状态",
          privilegeType: 2
        },
        {
          objectId: "updateusergroup",
          parentId: "8010301",
          privilegeCode: "updateusergroup",
          privilegeId: "801030103",
          privilegeLevel: 3,
          privilegeName: "修改用户群",
          privilegeType: 2
        },
        {
          objectId: "qryusergroup",
          parentId: "8010301",
          privilegeCode: "qryusergroup",
          privilegeId: "801030101",
          privilegeLevel: 3,
          privilegeName: "查询用户群",
          privilegeType: 2
        },
        {
          objectId: "8010301",
          parentId: "80103",
          privilegeCode: "irs8010301",
          privilegeId: "8010301",
          privilegeLevel: 2,
          privilegeName: "用户群管理",
          privilegeType: 1
        },
        {
          objectId: "addrule",
          parentId: "8010201",
          privilegeCode: "addrule",
          privilegeId: "801020104",
          privilegeLevel: 3,
          privilegeName: "新增规则",
          privilegeType: 2
        },
        {
          objectId: "delrule",
          parentId: "8010201",
          privilegeCode: "delrule",
          privilegeId: "801020103",
          privilegeLevel: 3,
          privilegeName: "删除规则",
          privilegeType: 2
        },
        {
          objectId: "updaterule",
          parentId: "8010201",
          privilegeCode: "updaterule",
          privilegeId: "801020102",
          privilegeLevel: 3,
          privilegeName: "编辑规则",
          privilegeType: 2
        },
        {
          objectId: "qryrule",
          parentId: "8010201",
          privilegeCode: "qryrule",
          privilegeId: "801020101",
          privilegeLevel: 3,
          privilegeName: "查询规则",
          privilegeType: 2
        },
        {
          objectId: "8010201",
          parentId: "80102",
          privilegeCode: "irs8010201",
          privilegeId: "8010201",
          privilegeLevel: 2,
          privilegeName: "规则管理",
          privilegeType: 1
        },
        {
          objectId: "qryquotainfo",
          parentId: "8010101",
          privilegeCode: "qryquotainfo",
          privilegeId: "801010102",
          privilegeLevel: 3,
          privilegeName: "查询看板指标信息",
          privilegeType: 2
        },
        {
          objectId: "qryscenebyuser",
          parentId: "8010101",
          privilegeCode: "qryscenebyuser",
          privilegeId: "801010101",
          privilegeLevel: 3,
          privilegeName: "查询用户对应的场景",
          privilegeType: 2
        },
        {
          objectId: "8010101",
          parentId: "80101",
          privilegeCode: "irs8010101",
          privilegeId: "8010101",
          privilegeLevel: 2,
          privilegeName: "看板",
          privilegeType: 1
        },
        {
          objectId: "80109",
          parentId: "801",
          privilegeCode: "irs80109",
          privilegeId: "80109",
          privilegeLevel: 2,
          privilegeName: "系统设置",
          privilegeType: 1
        },
        {
          objectId: "80107",
          parentId: "801",
          privilegeCode: "irs80107",
          privilegeId: "80107",
          privilegeLevel: 2,
          privilegeName: "AB测试",
          privilegeType: 1
        },
        {
          objectId: "80106",
          parentId: "801",
          privilegeCode: "irs80106",
          privilegeId: "80106",
          privilegeLevel: 2,
          privilegeName: "场景管理",
          privilegeType: 1
        },
        {
          objectId: "80105",
          parentId: "801",
          privilegeCode: "irs80105",
          privilegeId: "80105",
          privilegeLevel: 2,
          privilegeName: "算法管理",
          privilegeType: 1
        },
        {
          objectId: "80104",
          parentId: "801",
          privilegeCode: "irs80104",
          privilegeId: "80104",
          privilegeLevel: 2,
          privilegeName: "片池管理",
          privilegeType: 1
        },
        {
          objectId: "80103",
          parentId: "801",
          privilegeCode: "irs80103",
          privilegeId: "80103",
          privilegeLevel: 2,
          privilegeName: "用户群管理",
          privilegeType: 1
        },
        {
          objectId: "80102",
          parentId: "801",
          privilegeCode: "irs80102",
          privilegeId: "80102",
          privilegeLevel: 2,
          privilegeName: "规则管理",
          privilegeType: 1
        },
        {
          objectId: "80101",
          parentId: "801",
          privilegeCode: "irs80101",
          privilegeId: "80101",
          privilegeLevel: 2,
          privilegeName: "看板",
          privilegeType: 1
        },
        {
          objectId: "701012",
          parentId: "701",
          privilegeCode: "comp_prodsubsusers",
          privilegeId: "701012",
          privilegeLevel: 3,
          privilegeName: "分产品订购用户数",
          privilegeType: 2
        },
        {
          objectId: "701011",
          parentId: "701",
          privilegeCode: "comp_unsubusers",
          privilegeId: "701011",
          privilegeLevel: 3,
          privilegeName: "主动退订用户",
          privilegeType: 2
        },
        {
          objectId: "701010",
          parentId: "701",
          privilegeCode: "comp_newpayusers",
          privilegeId: "701010",
          privilegeLevel: 3,
          privilegeName: "新增订购用户",
          privilegeType: 2
        },
        {
          objectId: "701009",
          parentId: "701",
          privilegeCode: "comp_payusers",
          privilegeId: "701009",
          privilegeLevel: 3,
          privilegeName: "付费用户",
          privilegeType: 2
        },
        {
          objectId: "701008",
          parentId: "701",
          privilegeCode: "comp_activiuser",
          privilegeId: "701008",
          privilegeLevel: 3,
          privilegeName: "活跃用户",
          privilegeType: 2
        },
        {
          objectId: "701007",
          parentId: "701",
          privilegeCode: "comp_opentvuser",
          privilegeId: "701007",
          privilegeLevel: 3,
          privilegeName: "开机用户",
          privilegeType: 2
        },
        {
          objectId: "701006",
          parentId: "701",
          privilegeCode: "comp_newreactiviuser",
          privilegeId: "701006",
          privilegeLevel: 3,
          privilegeName: "新增激活用户",
          privilegeType: 2
        },
        {
          objectId: "701005",
          parentId: "701",
          privilegeCode: "comp_reactiviuser",
          privilegeId: "701005",
          privilegeLevel: 3,
          privilegeName: "激活用户",
          privilegeType: 2
        },
        {
          objectId: "701004",
          parentId: "701",
          privilegeCode: "comp_newiptvuser",
          privilegeId: "701004",
          privilegeLevel: 3,
          privilegeName: "新增视频用户",
          privilegeType: 2
        },
        {
          objectId: "701003",
          parentId: "701",
          privilegeCode: "comp_registuser",
          privilegeId: "701003",
          privilegeLevel: 3,
          privilegeName: "视频注册用户",
          privilegeType: 2
        },
        {
          objectId: "701002",
          parentId: "701",
          privilegeCode: "comp_contentres",
          privilegeId: "701002",
          privilegeLevel: 3,
          privilegeName: "内容资产",
          privilegeType: 2
        },
        {
          objectId: "701001",
          parentId: "701",
          privilegeCode: "comp_vodplaytop10",
          privilegeId: "701001",
          privilegeLevel: 3,
          privilegeName: "热播TOP10",
          privilegeType: 2
        },
        {
          objectId: "10000006",
          parentId: "10101",
          privilegeCode: "delnotice",
          privilegeId: "10000006",
          privilegeLevel: 3,
          privilegeName: "删除公告",
          privilegeType: 2
        },
        {
          objectId: "10000005",
          parentId: "10101",
          privilegeCode: "addnotice",
          privilegeId: "10000005",
          privilegeLevel: 3,
          privilegeName: "新增公告",
          privilegeType: 2
        },
        {
          objectId: "10000004",
          parentId: "10102",
          privilegeCode: "addmsg",
          privilegeId: "10000004",
          privilegeLevel: 3,
          privilegeName: "新增消息",
          privilegeType: 2
        },
        {
          objectId: "8010501",
          parentId: "80105",
          privilegeCode: "irs8010501",
          privilegeId: "8010501",
          privilegeLevel: 2,
          privilegeName: "算法管理",
          privilegeType: 1
        },
        {
          objectId: "qryalgorithm",
          parentId: "8010501",
          privilegeCode: "qryalgorithm",
          privilegeId: "801050101",
          privilegeLevel: 3,
          privilegeName: "查询算法列表",
          privilegeType: 2
        },
        {
          objectId: "addalgorith",
          parentId: "8010501",
          privilegeCode: "addalgorith",
          privilegeId: "801050102",
          privilegeLevel: 3,
          privilegeName: "新增算法",
          privilegeType: 2
        },
        {
          objectId: "updatealgorithm",
          parentId: "8010501",
          privilegeCode: "updatealgorithm",
          privilegeId: "801050103",
          privilegeLevel: 3,
          privilegeName: "修改算法",
          privilegeType: 2
        },
        {
          objectId: "delalgorithm",
          parentId: "8010501",
          privilegeCode: "delalgorithm",
          privilegeId: "801050104",
          privilegeLevel: 3,
          privilegeName: "删除算法",
          privilegeType: 2
        },
        {
          objectId: "8010601",
          parentId: "80106",
          privilegeCode: "irs8010601",
          privilegeId: "8010601",
          privilegeLevel: 2,
          privilegeName: "场景管理",
          privilegeType: 1
        },
        {
          objectId: "qryscene",
          parentId: "8010601",
          privilegeCode: "qryscene",
          privilegeId: "801060101",
          privilegeLevel: 3,
          privilegeName: "查询场景列表",
          privilegeType: 2
        },
        {
          objectId: "addscene",
          parentId: "8010601",
          privilegeCode: "addscene",
          privilegeId: "801060102",
          privilegeLevel: 3,
          privilegeName: "新增场景",
          privilegeType: 2
        },
        {
          objectId: "delscene",
          parentId: "8010601",
          privilegeCode: "delscene",
          privilegeId: "801060103",
          privilegeLevel: 3,
          privilegeName: "删除场景",
          privilegeType: 2
        },
        {
          objectId: "updatescene",
          parentId: "8010601",
          privilegeCode: "updatescene",
          privilegeId: "801060104",
          privilegeLevel: 3,
          privilegeName: "修改场景",
          privilegeType: 2
        },
        {
          objectId: "8010701",
          parentId: "80107",
          privilegeCode: "irs8010701",
          privilegeId: "8010701",
          privilegeLevel: 2,
          privilegeName: "AB测试",
          privilegeType: 1
        },
        {
          objectId: "qryabtestinfo",
          parentId: "8010701",
          privilegeCode: "qryabtestinfo",
          privilegeId: "801070101",
          privilegeLevel: 3,
          privilegeName: "查询ab测试信息",
          privilegeType: 2
        },
        {
          objectId: "8010901",
          parentId: "80109",
          privilegeCode: "irs8010901",
          privilegeId: "8010901",
          privilegeLevel: 2,
          privilegeName: "规则配置",
          privilegeType: 1
        },
        {
          objectId: "sysmanage",
          parentId: "8010901",
          privilegeCode: "sysmanage",
          privilegeId: "801090101",
          privilegeLevel: 3,
          privilegeName: "修改配置",
          privilegeType: 2
        },
        {
          objectId: "8010902",
          parentId: "80109",
          privilegeCode: "irs8010902",
          privilegeId: "8010902",
          privilegeLevel: 2,
          privilegeName: "API配置",
          privilegeType: 1
        },
        {
          objectId: "8010903",
          parentId: "80109",
          privilegeCode: "irs8010903",
          privilegeId: "8010903",
          privilegeLevel: 2,
          privilegeName: "用户测试",
          privilegeType: 1
        },
        {
          objectId: "8010904",
          parentId: "80109",
          privilegeCode: "irs8010904",
          privilegeId: "8010904",
          privilegeLevel: 2,
          privilegeName: "系统监控",
          privilegeType: 1
        },
        {
          objectId: "addusergroup",
          parentId: "8010301",
          privilegeCode: "addusergroup",
          privilegeId: "801030102",
          privilegeLevel: 3,
          privilegeName: "新增用户群",
          privilegeType: 2
        }
      ];
      // let arrA = [];
      // data.forEach((item, index) => {
      //   if (item.parentId === "-1") {
      //     arrA.push(item);
      //     arrA.forEach((aItem, aIndex) => {
      //       let arrB = [];
      //       data.forEach((bItem, bIndex) => {
      //         if (aItem.objectId === bItem.parentId) {
      //           arrB.push(bItem);
      //           arrB.forEach((bItem, bIndex) => {
      //             let arrC = [];
      //             data.forEach((cItem, cIndex) => {
      //               if (bItem.objectId === cItem.parentId) {
      //                 arrC.push(cItem);
      //                 arrC.forEach((bItem, bIndex) => {
      //                   let arrD = [];
      //                   data.forEach((dItem, dIndex) => {
      //                     if (cItem.objectId === dItem.parentId) {
      //                       arrD.push(dItem);
      //                     }
      //                   });
      //                   cItem.children = arrD;
      //                 });
      //               }
      //             });
      //             bItem.children = arrC;
      //           });
      //         }
      //       });
      //       aItem.children = arrB;
      //     });
      //   }
      // });

      // let arrA = data.filter(r => r.parentId === "-1");
      // arrA.forEach(r => {
      //   r.children = data.filter(rr => rr.parentId === r.objectId);
      // });
      let arrTree = parent => {
        let newArr = [];
        data.forEach(item => {
          if (item.parentId === parent) {
            item.children = arrTree(item.objectId);
            newArr.push(item);
          }
        });
        return newArr;
      };
      console.log(arrTree("-1"), "ajax");
      this.rightsList = arrTree("-1");
      //lau 始+++++++++++++++++++++++++++++++++++
      // const myMenuCode = [
      //   "modnoticeread",
      //   "docworkbench",
      //   "irs8010902",
      //   "delnotice"
      // ];
      // const filterMenu = (arrA, menuCode) => {
      //   return arrA
      //     .filter(item => {
      //       return menuCode.indexOf(item.privilegeCode) > -1;
      //     })
      //     .map(item => {
      //       item = Object.assign({}, item);
      //       if (item.children) {
      //         item.children = filterMenu(item.children, menuCode);
      //       }
      //       return item;
      //     });
      // };
      // const myMenu = filterMenu(arrA, myMenuCode);
      // this.rightsList = myMenu;
      // console.log(myMenu, "奎因123");
    },
    save(){
      const pvgList = this.$refs.tree.getHalfCheckedKeys();
      console.log(pvgList, "贾克斯");
    },
    checkboxSelect(data,status){
      this.allIdArr = status.checkedKeys.concat(status.halfCheckedKeys)
      console.log(this.allIdArr.length,'奎因');
      console.log(status,'宋江');
      console.log(status.halfCheckedKeys,'吴用');
    }
  }
};
</script>

<style scoped>
.btn-wrap {
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  /* align-items: center; */
}
.elIpt /deep/.el-input__inner {
  border-color: gold;
  outline: none;
  width: 200px;
}
</style>
