<template>
  <div class="sys-header" style="display:flex;">
    <slot name="topnav"></slot>
    <div class="scroll">
      <marquee v-if="honorString"  align="left" behavior="scroll"  height="40"   onMouseOut="this.start()" onMouseOver="this.stop()">
        <div class="scroll-content" v-html="honorString"></div>
      </marquee>
    </div>
    <div class="userInfo">
      <ul>
        <li>
          <el-dropdown @command="userOperation" trigger="click">
                        <span class="user">
                          <img class="nav-user-photo" :src="$store.state.user.companyId==='group'?require('../../assets/images/avatars/default-user-icon_36px.png'):getUserAvatar" alt="User profile">
                          <!-- <img class="nav-user-photo" src="../../assets/images/avatars/user.jpg" alt="Jason's Photo"> -->
                          {{'realname'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="editPaw" v-if="$store.state.user.companyId !== 'group'">修改密码</el-dropdown-item>
              <el-dropdown-item command="information" v-if="$store.state.user.companyId !== 'group'">个人信息</el-dropdown-item>
              <el-dropdown-item command="storeInformation" v-if="$store.state.user.positionType === 2">门店信息</el-dropdown-item>
              <!--<el-dropdown-item command="attendance">考勤</el-dropdown-item>-->
              <el-dropdown-item command="summary" v-if="$store.state.user.type === 1 && $store.state.user.companyId !== 'group'">工作总结</el-dropdown-item>
              <!-- <el-dropdown-item command="">操作手册</el-dropdown-item> -->
              <el-dropdown-item command="transform_area" v-if="$store.state.user.organizationList.length > 1">切换区域</el-dropdown-item>
              <el-dropdown-item command="transform_store" v-if="$store.state.user.storeList.length > 1">切换门店</el-dropdown-item>
              <el-dropdown-item command="locking">锁屏</el-dropdown-item>
              <el-dropdown-item command="logout">登出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
    <el-dialog
      :title="changePwdTitle"
      :visible.sync="dialog.editPaw.show"
      :modal-append-to-body="false"
      custom-class="editPawDialog"
      :before-close="handleClose"
      width="30%">
      <el-form :model="editPaw" :rules="editPawRules" status-icon ref="editPaw" label-width="100px" size="mini">
        <el-form-item label="原密码" prop="oldPaw">
          <el-input clearable v-model="editPaw.oldPaw" placeholder="请输入原密码" auto-complete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPaw">
          <el-input clearable v-model="editPaw.newPaw" placeholder="请输入新密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPaw">
          <el-input clearable v-model="editPaw.confirmNewPaw" placeholder="请再次输入新密码" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div class="textC">
        <el-button @click="cancelBtn" size="mini">取 消</el-button>
        <el-button type="primary" @click="editPawSubmit" size="mini">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="退出登录"
      :visible.sync="showLogout"
      width="30%"
      :modal-append-to-body="false"
    >
      确认退出？
      <span slot="footer">
            <div v-if="$store.state.user.type === 0">
               <el-button v-if="$store.state.user.companyId !== 'group'" type="primary" size="mini" @click="toWriteRecord">写工作记录</el-button>
               <el-button type="text" size="mini" @click="logOut('退出')">退出</el-button>
            </div>
            <div v-else-if="$store.state.user.type === 1">
              <!-- <el-button type="primary" size="mini" @click="logOut('外出')">外出</el-button>
              <el-button type="primary" size="mini" @click="logOut('请假')">请假</el-button> -->
              <el-button v-if="$store.state.user.companyId !== 'group'" type="primary" size="mini" @click="logOut('下班')">下班</el-button>
              <el-button type="text" size="mini" @click="logOut('正常退出')">正常退出</el-button>
            </div>
            <div v-else>
              <el-button type="text" size="mini" @click="logOut('正常退出')">退出</el-button>
            </div>
          </span>
    </el-dialog>
  </div>

</template>

<script>
import { mapActions } from 'vuex'
import { url } from 'url'
export default {
  data () {
    // 新密码自定义规则
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value === '123456' || value === this.$store.state.user.mobile) {
        callback(new Error('请不要使用初始密码'))
      } else {
        // 验证重新输入新密码是否有值
        if (this.editPaw.confirmNewPaw !== '') {
          // 调用相关校验规则
          this.$refs.editPaw.validateField('confirmNewPaw')
        }
        callback()
      }
    }
    // 重新输入新密码自定义规则
    const validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.editPaw.newPaw) {
        callback(new Error('两次输入密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      transform_area: false,
      transform_store: false,
      curStore: '',
      curArea: '',
      dialog: {
        editPaw: {
          show: false
        }
      },
      editPaw: {
        oldPaw: '',
        newPaw: '',
        confirmNewPaw: ''
      },
      editPawRules: {
        oldPaw: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPaw: [
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmNewPaw: [
          { validator: validateNewPass, trigger: 'blur' }
        ]
      },
      showLogout: false,
      honorString: '',
      changePwdTitle: '修改密码'
    }
  },
  computed: {
    getUserAvatar () {
      let userAvatar = ''
      if (!userAvatar) {
        userAvatar = require('../../assets/images/avatars/default-user-icon_36px.png')
      }
      return userAvatar
    }
  },
  methods: {
    ...mapActions({
      sysGetNavList: 'auth/getNavList'
    }),
    userOperation (command) {
      switch (command) {
        case 'logout':
          this.logout()
          break
        case 'transform_area':
          this.transform_area = true
          this.curArea = this.authRolesInfor.currentOrganizationCode
          break
        case 'transform_store':
          this.curStore = this.authRolesInfor.storeNo
          this.transform_store = true
          break
        case 'editPaw':
          this.dialog.editPaw.show = true
          break
        case 'locking':
          this.$store.commit('loading/changeIsLocking', true)
          break
        case 'information':
          this.toInformation()
          break
        case 'storeInformation':
          this.toStoreInformation()
          break
        case 'attendance':
          this.toAttendance()
          break
        case 'summary':
          this.$router.push('/main/summary/list')
          break
      }
    },
    logout () {
      this.showLogout = true
    },
    toWriteRecord () {
      this.showLogout = false
      this.$router.push('/main/workrecord/add')
    },
    toInformation () {
      // 获取职务code
      // const realname = this.realname
      const positionType = this.$store.state.user.positionType
      const username = this.authRolesInfor.username
      if (this.$store.state.user.type === 1) { // 如果不是中环员工
        if (positionType) {
          if (positionType === 2) { // 如果是店长
            this.$router.push(`/main/store/director-details/${username}`)
          } else {
            this.$router.push(`/main/store/staff-details/${username}`)
          }
        } else {
          return false
        }
      } else { // 如果是中环员工
        this.$router.push(`/main/store/company-staff-details/${username}`)
      }
    },
    toStoreInformation () {
      // 获取职务code
      const storeNo = this.authRolesInfor.storeNo
      this.$router.push(`/main/store/details/${storeNo}`)
    },
    toAttendance () {
      if (this.$store.state.user.type === 1) {
        // this.$router.push(`/main/attendance/store-staff${this.authRolesInfor}`)
        // this.$router.push(`/main/attendance/store-staff`)
      } else {
        // this.$router.push(`/main/attendance/central-staff`)
      }
    },
    logOut (type) {
      // this.sysLogout().then(() => {
      //   this.$router.push('/')
      // })
      if (this.$store.state.user.companyId !== 'group') {
        const t = encodeURIComponent(type)
        this.post('/sale/api/v1/login/logout?logoutType=' + t, {}, () => {
          this.sysLogout().then(() => {
            // this.$router.push({
            //   path: '/',
            //   query: { logout: 'true' }
            // })
            this.$router.push('/')
            this.$electron.ipcRenderer.send('closeWindow')
            this.delAll()
          })
        })
      } else {
        this.post('/uaa/oauth/logout', {}, () => {
          this.sysLogout().then(() => {
            this.$router.push('/')
            this.$electron.ipcRenderer.send('closeWindow')
            this.delAll()
          })
        })
      }
    },
    handleClose (done) {
      this.resetForm('editPaw')
      done()
    },
    cancelBtn () {
      this.resetForm('editPaw')
      this.dialog.editPaw.show = false
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    editPawSubmit () {
      const self = this
      self.$refs.editPaw.validate((valid) => {
        if (valid) {
          const username = self.authRolesInfor.username
          if (username) {
            const account = {
              username: username,
              oldPassword: self.editPaw.oldPaw,
              password: self.editPaw.newPaw
            }
            self.put('/sale/api/v1/account/pwd/current', account, function (result) {
              // 提醒
              self.$message.success('修改成功')
              self.dialog.editPaw.show = false
              if (!self.$store.state.user.isChangedPwd) {
                // 修改密码成功
                self.$store.commit('user/setChangePwd', true)
              }
              self.resetForm('editPaw')
            })
          } else {
            self.$message({
              message: '获取用户信息失败！',
              type: 'warning'
            })
          }
        } else {
          return false
        }
      })
    },
    getHonor () {
      this.honorString = ''
      this.get('/sale/api/v1/honor/account', {}, ({ data }) => {
        data.forEach(item => {
          this.honorString += `<span><img src=${this.staticURL() + '/static/honor/' + item.icon}> 本人获得${item.name}！</span>`
        })
      })
      // let positionType = this.$store.state.user.positionType
      // if (positionType - 2 === 0 || positionType - 4 === 0) {
      this.get('/sale/api/v1/honor/store', {}, ({ data }) => {
        data.forEach(item => {
          this.honorString += `<span><img src=${this.staticURL() + '/static/honor/' + item.icon}> 本店获得${item.name}！</span>`
        })
      })
      // }
    }
  },
  created () {
  },
  mounted () {
    this.sysGetNavList().then((resolveMenu) => {
      if (resolveMenu && resolveMenu !== 'fail') {
        this.$store.commit('tagNav/removeTagNav', '')
        const homeRouter = Object.assign({}, resolveMenu[0])
        homeRouter.fullPath = homeRouter.path
        homeRouter.title = homeRouter.name
        this.$store.commit('tagNav/addTagNav', homeRouter)
        this.$router.push(resolveMenu[0].path)
        url('success')
      } else {
        this.$message.error('获取菜单失败！')
      }
    })
  }
}
</script>
<style scoped>
  .sys-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .scroll{
    flex:1;
    color:#fff;
    line-height:40px;
    height:40px;
    padding: 0 20px;
    font-weight: 500;
  }
  .scroll-content{
    display: flex;
  }
  .scroll-content >>> span{
    display: flex;
    align-items: center;
    padding-right:20px;
    font-size: 14px;
  }
  .scroll-content >>> span img {
    width: 19px;
    height: 38px;
    margin-right: 10px;
  }
  .nav-user-photo {
    position: absolute;
    clip: rect(0px 40px 40px 0px);
    left: -50px;
  }
</style>
