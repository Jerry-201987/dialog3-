import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
let store = new Vuex.Store({
    state: {
        nickname: "Simba",
        userlist: [
            { name: "aaa", gender: 0 },
            { name: "bbb", gender: 1 },
            { name: "ccc", gender: 1 },
            { name: "ddd", gender: 0 },
        ]
    },
    getters: {
        female(state) {
            return state.userlist.filter(r => !r.gender)
        },
        male(state) {
            return state.userlist.filter(r => r.gender)
        }
    },
    mutations: {
        setNickname(state, val) {
            state.nickname = val
        }
    },
    actions: {},
    modules: {}
})

export default store
-----------------------------------------------------------------------
// 系统管理数据总仓库
import { qryRoleList, qryPrivilegesList, qryRoleDetail, addRole, editRole, deleteRole } from '@/api/role-manage'
import { Message } from 'element-ui'
export default {
  namespaced: true,
  state: {
    isLoading: false,
    //   角色数据集合
    roleOption: {
      // 角色列表数据
      roleList: [],
      total: 0,
      // 权限清单数据
      privilegesList: [],
      // 已有权限ID集合
      rolePrivileges: [],
      // 角色级别数据
      roleLevelList: [
        { value: '1', label: '1级' },
        { value: '2', label: '2级' },
        { value: '3', label: '3级' },
        { value: '4', label: '4级' },
        { value: '5', label: '5级' }
      ]
    }
  },
  getters: {
    // 根据当前登录用户的角色级别来过滤 角色集合数据
    computedRoleLevelList: (state) => {
      return level => {
        const { roleLevelList } = state.roleOption
        return roleLevelList.filter(i => i.value > level)
      }
    }
  },
  mutations: {
    // 同步loading信号
    setIsLoading: (state, pl = true) => (state.isLoading = pl),
    // 同步 角色总数据模型
    setRoleOption: (state, pl) => Object.assign(state.roleOption, pl)
  },
  actions: {
    // 请求角色列表数据
    async getRoleList({ commit, state }, params) {
      // 清空权限数据
      commit('setRoleOption', { roleList: [] })
      commit('setIsLoading')
      try {
        const resp = await qryRoleList(params)
        const _object = {
          roleList: resp.data,
          total: resp.total || resp.data.length
        }
        commit('setRoleOption', _object)
      } catch (error) {
        Message({
          type: 'error',
          message: error.message || '获取角色列表数据失败！'
        })
      } finally {
        commit('setIsLoading', false)
      }
    },
    // 请求角色权限列表数据
    async getPrivilegesList({ commit, state }, params) {
      // 清空权限数据
      commit('setRoleOption', { privilegesList: [] })
      commit('setIsLoading')
      try {
        const resp = await qryPrivilegesList(params)
        let arrA = []
        resp.data.forEach((item,index)=>{
          if (item.parentId === "-1") {
            arrA.push(item);
            arrA.forEach((aItem, aIndex) => {
              let arrB = [];
              resp.data.forEach((bItem, bIndex) => {
                if (aItem.objectId === bItem.parentId) {
                  arrB.push(bItem);
                  arrB.forEach((bItem, bIndex) => {
                    let arrC = [];
                    resp.data.forEach((cItem, cIndex) => {
                      if (bItem.objectId === cItem.parentId) {
                        arrC.push(cItem);
                      }
                    });
                    bItem.children = arrC;
                  });
                }
              });
              aItem.children = arrB;
            });
          }
        });
        const _object = {
          privilegesList: arrA
        }
        commit('setRoleOption', _object)
      } catch (error) {
        Message({
          type: 'error',
          message: error.message || '获取权限列表数据失败！'
        })
      } finally {
        commit('setIsLoading', false)
      }
    },
    // 请求角色详情数据
    async getRoleDetail({ commit, state }, params) {
      // 清空权限数据
      commit('setRoleOption', { rolePrivileges: [] })
      commit('setIsLoading')
      try {
        console.log(222)
        const resp = await qryRoleDetail(params)
        const _object = {
          rolePrivileges: resp.data.rolePrivileges
        }
        commit('setRoleOption', _object)
      } catch (error) {
        Message({
          type: 'error',
          message: error.message || '获取角色详情数据失败！'
        })
      } finally {
        commit('setIsLoading', false)
      }
    },
    // 新增角色
    async addRole({ commit, state }, params) {
      commit('setIsLoading')
      try {
        await addRole(params)
        Message({
          type: 'success',
          message: '新增角色成功，马上为您返回角色列表页面！'
        })
        return true
      } catch (error) {
        Message({
          type: 'error',
          message: error.message || '新增角色失败！'
        })
      } finally {
        commit('setIsLoading', false)
      }
    },
    // 编辑角色详情数据
    async editRole({ commit, state }, params) {
      commit('setIsLoading')
      try {
        await editRole(params)
        Message({
          type: 'success',
          message: '编辑角色成功，马上为您返回角色列表页面！'
        })
        return true
      } catch (error) {
        Message({
          type: 'error',
          message: error.message || '编辑角色失败！'
        })
      } finally {
        commit('setIsLoading', false)
      }
    },
    // 删除角色
    async deleteRole({ commit, state }, params) {
      commit('setIsLoading')
      try {
        await deleteRole(params)
        Message({
          type: 'success',
          message: '删除角色成功！'
        })
      } catch (error) {
        Message({
          type: 'error',
          message: error.message || '删除角色失败！'
        })
      } finally {
        commit('setIsLoading', false)
      }
    }
  }
}
