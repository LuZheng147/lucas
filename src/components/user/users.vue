<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 导航与搜索 -->
      <el-row :gutter="50">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="success" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户表格 -->
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="statusChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delateUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="修改权限"
              placement="top-end"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setUserRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="resetForm">
      <el-form :model="addruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model=" addruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model=" addruleForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户弹出框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="40%" @close="resetEditForm">
      <el-form :model="editruleForm" :rules="editrules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model=" editruleForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 更改权限弹框 -->
    <el-dialog title="修改用户权限" :visible.sync="SetDialogVisible" width="40%">
      <el-form
        :model="setUserRoleForm"
        :rules="editrules"
        ref="setUserRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="当前用户名">
          <el-input v-model="setUserRoleForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前用户权限">
          <el-input v-model="setUserRoleForm.role" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配新角色">
          <el-select v-model="setUserRoleForm.region" placeholder="请选择">
            <el-option label="初级工程师" value="shanghai"></el-option>
            <el-option label="中级工程师" value="beijing"></el-option>
            <el-option label="高级工程师" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SetDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除用户对话框 -->
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const Emailmodel = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (Emailmodel.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的邮箱地址'))
    }
    var checkMobil = (rule, value, callback) => {
      const Mobilmodel = /^[1][3,4,5,7,8][0-9]{9}$/
      if (Mobilmodel.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      SetDialogVisible: false,
      addruleForm: {
        username: 'admin',
        password: '125012',
        email: '125012@qq.com',
        mobile: '13512345678',
      },
      //编辑用户验证规则
      editruleForm: {},
      editrules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobil, trigger: 'blur' },
        ],
      },
      //定义表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 6,
            message: '用户名长度为2到6个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobil, trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '密码长度为6到12个字符',
            trigger: 'blur',
          },
        ],
      },
      setUserRoleForm: {},
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status != 200)
        return this.$message.error('获取管理员列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    //修改用户状态
    async statusChanged(status) {
      const { data: res } = await this.$http.put(
        `users/${status.id}/state/${status.mg_state}`
      )
      if (res.meta.status != 200) {
        status.mg_state = !status.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    //重置表单
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    resetEditForm() {
      this.$refs.editFormRef.resetFields()
    },
    //添加用户
    async addUser() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('验证失败')
        }
        //验证通过就上传数据
        const { data: res } = await this.$http.post('users', this.addruleForm)
        if (res.meta.status != 201) {
          return this.$message.error('创建用户失败')
        }
        this.$message.success('创建用户成功')
        this.addDialogVisible = false
        this.getUsersList()
      })
    },
    // 编辑用户
    async editUser(user) {
      // 根据用户id获取用户信息
      const { data: res } = await this.$http.get('users/' + user.id)
      if (res.meta.status != 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.editruleForm = res.data
      this.editDialogVisible = true
    },
    //提交之前的预验证
    edit() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('验证失败')
        }
        //验证通过就发起请求，修改数据
        const { data: res } = await this.$http.put(
          'users/' + this.editruleForm.id,
          this.editruleForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.editDialogVisible = false
        this.getUsersList()
      })
    },
    async setUserRole(user) {
      const { data: res } = await this.$http.get('users/' + user.id)
      if (res.meta.status != 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.setUserRoleForm = res.data
      this.SetDialogVisible = true
    },
    //删除用户
    async  delateUser(id) {
     const confirmResult= await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch( err => err)
      if(confirmResult!="confirm"){
        return this.$message('已取消删除')
      }
      const {data:res} = await this.$http.delete('users/'+id)
      if(res.meta.status!==200&&res.meta.status!==400){
        return this.$message.error("删除用户失败")
      }else if(res.meta.status==400){
        return this.$message.error("不允许删除admin")
      }
      this.getUsersList()
      this.$message.success('删除用户成功')
    },
  },
}
</script>
<style lang="less">
</style>