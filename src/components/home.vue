<template>
  <!-- 头部区域 -->
  <el-container class="home-container">
    <el-header>
      <div>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体内容 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="collapseButton" @click="collapseToggle()"><span class="el-icon-s-fold"></span></div>
        <el-menu background-color="#e4f5ef" text-color="black" active-text-color="#42B983"
         unique-opened :collapse="isCollapse" :collapse-transition="false" router  :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+items.path" v-for="items in item.children" :key="items.id" @click="stayActive('/'+items.path)" >
              <i class="el-icon-menu"></i>{{items.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 中间内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj:{
        '125':'el-icon-user-solid',
        '103':'el-icon-set-up',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-order',
        '145':'el-icon-s-marketing'
      },
     isCollapse:false,
     activePath:''
    }
  },
  created() {
    this.getMeunlist()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取所有的菜单
    async getMeunlist() {
      const {data:res} = await this.$http.get('menus')
      this.menuList=res.data
    },
    collapseToggle(){
      this.isCollapse=!this.isCollapse
    },
    stayActive(activePath){
      window.sessionStorage.setItem("activePath",activePath)
      this.activePath = activePath
    }
  },
}
</script>

<style lang="less" scoped>
.el-header {
  background: #bbe6d6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    img {
      width: 50px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background: #e4f5ef;
  .el-menu{
    border:none;
  }
  .collapseButton{
    background: #F5FBF9;
    text-align: center;
    cursor: pointer;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 2px;
  }
}
.el-main {
  background: #c8ebdf;
}
.home-container {
  height: 100%;
}
</style>