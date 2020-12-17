<template>
  <aui-dialog-wapper ref="auidialogwapper" dialog-title="创建消息" width="50rem">
    <el-form
      label-position="right"
      label-width="80px"
      :model="params"
      :rules="rules"
      ref="informationForm"
    >
      <el-form-item label="消息内容" prop="content">
        <el-input
          v-model="params.content"
          class="information-textarea"
          type="textarea"
          resize="none"
          placeholder="请输入内容"
          maxlength="140"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="接收人" prop="recivers">
        <el-select v-model="params.recivers" multiple placeholder="请选择" class="aui-select">
          <div slot="empty" class="aui-select-content">
            <el-input v-model="searchValue" type="text" placeholder="请输入关键字搜索" @keyup.enter.native="handelSearch">
              <el-button
                slot="append"
                class="add-information-search"
                icon="el-icon-search"
                @click="handelSearch"
              ></el-button>
            </el-input>
            <div v-if="options.length !== 0" class="aui-select-content-check">
              <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <div class="aui-select-check-group">
                <el-checkbox-group v-model="params.recivers" class="aui-checkbox-group" @change="handleCheckChange">
                  <el-checkbox v-for="item in options" :value="item.userId" :key="item.userId" :label="item.nickname">
                    {{ item.nickname?item.nickname:'' }}
                    <span style="color:#999">{{ item.nickname&&item.rolename?'('+item.rolename+')':''}}</span>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div v-if="options.length === 0" class="aui-select-content-check-not">暂无搜索结果</div>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="params.remark"
          class="information-textarea"
          type="textarea"
          resize="none"
          placeholder="请输入..."
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <div class="notice-add-dialog-from-footer">
        <el-button class="aui-ghost-button" @click="handleCancel">取消</el-button>
        <el-button class="aui-primary-button" @click="handleSubmit">确定</el-button>
      </div>
    </el-form>
  </aui-dialog-wapper>
</template>

<script>
import {mapState} from 'vuex'
import AuiDialogWapper from '../../../components/Aui-Dialog-Wapper/AuiDialogWapper'
import { getUserList, createMsg } from '@/api/system.js'
export default {

  components: { AuiDialogWapper },
  data () {
    return {
      centerDialogVisible: false,
      searchValue: '',
      checkAll: false,
      rules: {
        content: [
          { required: true, message: '请输入消息内容', trigger: 'blur' }
        ],
        recivers: [
          { required: true, message: '请输入接收人', trigger: 'blur' }
        ]
      },
      params: {
        content: '',
        recivers: [],
        remark: ''
      },
      options: []
    }
  },
  watch: {
    checkAlls () {
      this.checkAll = this.checkAlls
    }
  },
  computed: {
    ...mapState(['maxArrayLength']),
    checkAlls () {
      if (this.params.recivers.length < this.options.length) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    // 显示弹框清除验证以及数据
    async createInformation () {
      await this.$refs.auidialogwapper.handleShowDialog()
      this.searchValue = await ''
      await this.handelSearch()
      await this.$refs.informationForm.resetFields()
    },
    handleCancel () {
      this.$refs.auidialogwapper.handleCloseDialog()
    },
    //   点击查询
    handelSearch () {
      getUserList({ content: this.searchValue }).then(res => {
        this.options = res.data.datas || []
      })
    },
    // 点击全选按钮
    handleCheckAllChange () {
      let checkAllOption = []
      this.options.forEach((item) => {
        // checkAllOption.push(item)
        checkAllOption.push(item.nickname)//lau
        console.log(checkAllOption,'lau');//lau
      })
      this.params.recivers = this.checkAll ? checkAllOption : []
    },
    // 点击确认按钮
    handleSubmit () {
      this.$refs.informationForm.validate((valid) => {
        if (valid) {
          this.addInformation()
        } else {
          return false
        }
      })
    },
    // 监听check是否被点击
    handleCheckChange() {
      if (this.searchValue) {
        this.searchValue = ''
        this.handelSearch()
      }

    },
    // 新增消息
    addInformation () {
      if(this.params.recivers.length>this.maxArrayLength) {
        this.$message.error('最多选100条权限')
      }
      var recIds = [];
      for(var i=0;i<this.options.length;i++)
      {
        var nickname = this.options[i].nickname
        var recId = this.options[i].userId
        var reciversArray = this.params.recivers
        for(var j=0;j<reciversArray.length;j++)
        {
            var recName = reciversArray[j]
            if(nickname==recName)
            {
              recIds.push(recId)
            }
        }
        // this.nickname_XR = nickname
      }
      
      // this.params.recivers=recIds
      createMsg(Object.assign({...this.params},{recivers: recIds})).then(res => {
        if (res.data.resultCode === 'PUB-000000') {
          this.$message({
            message: '创建成功！',
            type: 'success'
          })
          this.$emit('handleRefresh', true)
          this.handleCancel()
        } else {
          this.$message({
            message: '创建失败！',
            type: 'error'
          })
        }
      })
    }
  },
  mounted () {
    this.handelSearch()
  }
}

</script>
<style lang='less' scoped>
.notice-add-dialog-from-footer {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.aui-select {
  width: 100%;
}
.aui-select-content-check-not{
  width: 100%;
  line-height: 9.125rem;
  font-size: 14px;
  color: #777;
  text-align: center;
}
.information-textarea {
  width: 100%;
  height: 5.625rem;
  .el-input__inner,
  .el-textarea__inner {
    height: 5.625rem;
  }
}
.aui-select-content {
  .el-input__inner {
    height: 34px;
  }
  .el-input.is-active .el-input__inner,
  .el-input__inner:focus {
    border-color: #dcdfe6;
  }
  .el-input-group__append {
    padding: 0 15px;
    height: 2rem;
  }
  .el-input-group__append {
    .add-information-search {
      height: 2rem;
    }
  }
}
</style>
