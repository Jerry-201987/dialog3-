# 组件间如何传值
1.父往子用props
2.子往父用$emit
3.祖孙之间，使用provide/inject，注入对象
4.兄弟同级之间，使用中央事件总线，创建单独的Vue实例利用$on/$emit帮助传递事件值
5.大型应用中，使用vuex，创建store统一管理state，使用getters包装state，使用mutations修改state，组件中使用this.$store.state.XXX/this.$store.getters.XXX/this.$store.commit(函数名,val)访问store，组件中可用computed来简化state/getters写法