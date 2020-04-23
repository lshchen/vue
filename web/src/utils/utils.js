/**
 * 工具类
 */
import Store from '../../store/index.js'
export default{
  install (Vue) {
    /**
     * 判断对象是否为空
     *
     * @param obj 对象
     * @return true: 为空, false: 不为空
     */
    Vue.prototype.isEmptyObject = (obj) => {
      if (Object.keys(obj).length > 0) {
        return false
      }
      return true
    }
    /**
     * 金额转换
     */
    Vue.prototype.convertCurrency = (money) => {
      // 汉字的数字
      var cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
      // 基本单位
      var cnIntRadice = ['', '拾', '佰', '仟']
      // 对应整数部分扩展单位
      var cnIntUnits = ['', '万', '亿', '兆']
      // 对应小数部分单位
      var cnDecUnits = ['角', '分', '毫', '厘']
      // 整数金额时后面跟的字符
      var cnInteger = '整'
      // 整型完以后的单位
      var cnIntLast = '元'
      // 最大处理的数字
      var maxNum = 999999999999999.9999
      // 金额整数部分
      var integerNum
      // 金额小数部分
      var decimalNum
      // 输出的中文金额字符串
      var chineseStr = ''
      // 分离金额后用的数组，预定义
      var parts
      if (money === '') { return '' }
      money = parseFloat(money)
      if (money >= maxNum) {
        // 超出最大处理数字
        return ''
      }
      if (money === 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger
        return chineseStr
      }
      // 转换为字符串
      money = money.toString()
      if (money.indexOf('.') === -1) {
        integerNum = money
        decimalNum = ''
      } else {
        parts = money.split('.')
        integerNum = parts[0]
        decimalNum = parts[1].substr(0, 4)
      }
      // 获取整型部分转换
      if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0
        var IntLen = integerNum.length
        for (var i = 0; i < IntLen; i++) {
          var n = integerNum.substr(i, 1)
          var p = IntLen - i - 1
          var q = p / 4
          var m = p % 4
          if (n === '0') {
            zeroCount++
          } else {
            if (zeroCount > 0) {
              chineseStr += cnNums[0]
            }
            // 归零
            zeroCount = 0
            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
          }
          if (m === 0 && zeroCount < 4) {
            chineseStr += cnIntUnits[q]
          }
        }
        chineseStr += cnIntLast
      }
      // 小数部分
      if (decimalNum !== '') {
        var decLen = decimalNum.length
        for (var j = 0; j < decLen; j++) {
          var d = decimalNum.substr(j, 1)
          if (d !== '0') {
            chineseStr += cnNums[Number(d)] + cnDecUnits[j]
          }
        }
      }
      if (chineseStr === '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger
      } else if (decimalNum === '') {
        chineseStr += cnInteger
      }
      return chineseStr
    }

    /**
     * 使用循环的方式判断一个元素是否存在于一个数组中
     * @param {Object} arr 数组
     * @param {Object} value 元素值
     */
    Vue.prototype.isInArray = (arr, value) => {
      for (var i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
          return true
        }
      }
      return false
    }

    Vue.prototype.closeTabTips = (objThis, openedPageList, message) => {
      if (!message) {
        message = '此操作将关闭当前页面, 是否继续?'
      }
      objThis.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Vue.prototype.closeTab(objThis, openedPageList)
      }).catch(() => {
        objThis.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }

    Vue.prototype.closeTab = (objThis, openedPageList) => {
      objThis.$store.commit('tagNav/removeTagNav', {fullPath: objThis.$route.fullPath})
      if (openedPageList) {
        objThis.$router.push(openedPageList[openedPageList.length - 1].fullPath)
      }
    }

    Vue.prototype.numberValidator = function (rule, value, callback) {
      if (/^[0-9]*$/.test(value) === false) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    Vue.prototype.decimalValidator = function (rule, value, callback) {
      if (/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(value) === false) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    Vue.prototype.mobileValidator = function (rule, value, callback) {
      if (/^1\d{10}$/.test(value) === false) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }

    Vue.prototype.telephoneValidator = function (rule, value, callback) {
      if (/\d{7,8}/.test(value) === false) {
        callback(new Error('请输入正确的座机号'))
      } else {
        callback()
      }
    }

    Vue.prototype.idCardValidator = function (rule, value, callback) {
      if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value) === false) {
        callback(new Error('请输入正确身份证号'))
      } else {
        callback()
      }
    }
    // 判断是否有权限
    Vue.prototype.ifHasAuth = function (authKey, personData) {
      let auth = Store.state.auth.auths[authKey]
      let curUserInfor = Store.state.user.authRolesInfor
      switch (auth) {
        case '本人':return !personData || (curUserInfor.username && curUserInfor.username === personData.username)
        case '本部门':return !personData || (curUserInfor.organizationCode && curUserInfor.organizationCode === personData.organizationCode)
        case '本大区':return !personData || (curUserInfor.largeRegionCode && curUserInfor.largeRegionCode === personData.largeRegionCode)
        case '本区域':return !personData || (curUserInfor.regionCode && curUserInfor.regionCode === personData.regionCode)
        case '本店':return !personData || (curUserInfor.storeNo && curUserInfor.storeNo === personData.storeNo)
        case '本组':
          if (!personData) {
            return true
          } else if (curUserInfor.storeGroupId) {
            return curUserInfor.storeGroupId && curUserInfor.storeGroupId === personData.storeGroupId
          } else {
            return curUserInfor.username && curUserInfor.username === personData.username
          }
        case '所有':return true
        case '0':return false
        case '禁止':return false
        case '1':return true
        case undefined:return false
      }
    }
    // 具有权限的列表查询时需要传登录人的信息
    Vue.prototype.formatPostBody = function (authKey) {
      let auth = Store.state.auth.auths[authKey]
      let curUserInfor = Store.state.user.authRolesInfor
      let msg = function (data, part) {
        return !data ? `当前列表的设置的权限是${auth}, 您不属于任何${part}` : ''
      }
      switch (auth) {
        case '本人':return {body: {dataOwner: curUserInfor.username}, msg: ''}
        case '本部门':return {body: {dataOrganizationCode: curUserInfor.organizationCode}, msg: msg(curUserInfor.organizationCode, '部门')}
        case '本大区':return {body: {dataLargeRegionCode: curUserInfor.largeRegionCode}, msg: msg(curUserInfor.largeRegionCode, '大区')}
        case '本区域':return {body: {dataRegionCode: curUserInfor.regionCode}, msg: msg(curUserInfor.regionCode, '区域')}
        case '本店':return {body: {dataStoreNo: curUserInfor.storeNo}, msg: msg(curUserInfor.storeNo, '门店')}
        case '本组':
          if (curUserInfor.storeGroupId) {
            return {body: {dataStoreGroupId: curUserInfor.storeGroupId}, msg: msg(curUserInfor.storeGroupId, '小组')}
          } else {
            return {body: {dataOwner: curUserInfor.username}, msg: ''}
          }
        case '所有': return {body: {}, msg: ''}
        default: return {body: {}, msg: '您没有当前列表的查看权限'}
      }
    }
    // 格式化人员信息用于权限判断
    Vue.prototype.formatPersonForAuth = function (data, key = 'data') {
      return {
        username: data[key + 'Owner'],
        organizationCode: data[key + 'OrganizationCode'],
        largeRegionCode: data[key + 'LargeRegionCode'],
        regionCode: data[key + 'RegionCode'],
        storeNo: data[key + 'StoreNo'],
        storeGroupId: data[key + 'StoreGroupId']
      }
    }
    // 根据vue name 找父组件
    Vue.prototype.findParentByName = function (vm, name) {
      let parent = vm.$parent || vm.$root
      while (parent !== vm.$root && parent.$options.name !== name) {
        parent = parent.$parent || vm.$root
      }
      return parent
    }
    // 根据vue name 找父组件
    Vue.prototype.imgBaseUrl = function (objThis, url) {
      if (url) {
        return url.indexOf('http') !== -1 ? url : objThis.$store.getters.ossDomain + url
      }
      return ''
    }
    // 根据所传时间参数判断是否是48小时内
    Vue.prototype.addTimeJudge = function (date) {
      // 当前时间戳
      let currentTime = Math.round(new Date() / 1000)
      let timeVal = this.getFormatDateTime(date)
      // 当前行最近添加时间戳
      let targetTime = new Date(timeVal).getTime() / 1000
      if ((currentTime - targetTime) <= 172800) { // 判断是否为48小时以内
        return true
      } else {
        return false
      }
    }
    // 根据所传时间参数判断是否超过days 超过返回true
    Vue.prototype.maintainDaysJudge = function (date, days) {
      // 当前时间戳
      let currentTime = Math.round(new Date() / 1000)
      let timeVal = this.getFormatDateTime(date)
      // 当前行最近添加时间戳
      let targetTime = new Date(timeVal).getTime() / 1000
      let compareDays = Number(days) * 24 * 60 * 60
      if ((currentTime - targetTime) > compareDays) { // 判断是否超过所传天数的秒
        return true
      } else {
        return false
      }
    }
    /**
     * 区间判断大小，如果有减数则判断，没有则返回true
     * @param {减数} subtrahend
     * @param {被减数} minuend
     */
    Vue.prototype.compareValFun = function (subtrahend, minuend) {
      if (subtrahend) {
        if (subtrahend - minuend >= 0) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    }
    Vue.prototype.getParams = function (filter) {
      let request = Object.keys(filter).map(function (key) {
        return key + '=' + filter[key]
      }).join('&')
      return request
    }
    Vue.prototype.setStyle = function (target, _self) {
      let timer = setTimeout(() => {
        target.style.color = '#C90A31'
      })
      _self.clearTimer(timer)
      timer = null
    }
    Vue.prototype.removeStyle = function (name) {
      let eles = document.getElementsByClassName(name)
      for (let i = 0; i < eles.length; i++) {
        eles[i].style.color = ''
      }
      eles = null
    }
    Vue.prototype.telephone = function (rule, value) {
      return /\d{7,8}/.test(value)
    }
    Vue.prototype.clearTimer = function (timer) {
      this.$once('hook:beforeDestroy', () => {
        clearTimeout(timer)
        timer = null
      })
    }
    Vue.prototype.callHook = function (vm, hook) {
      const handlers = vm.$options[hook]
      if (handlers) {
        for (let i = 0, j = handlers.length; i < j; i++) {
          try {
            handlers[i].call(vm)
          } catch (e) {
          }
        }
      }
    }
    Vue.prototype.cityChange = function (key) {
      let local = Store.state.user.companyId
      let nanchang = []
      let taiyuan = ['楼盘字典新增-附件', '签署委托-实勘表图片']
      let city = [
        {
          cityName: '南昌市',
          companyId: 104,
          cityObject: nanchang,
          strikeType: Vue.prototype.NcContractTypeEnum,
          strikeRentType: [2]
        },
        {
          cityName: '太原市',
          companyId: 101,
          cityObject: taiyuan,
          strikeType: Vue.prototype.TyContractTypeEnum,
          strikeRentType: [7, 8]
        }
      ]
      let num = city.findIndex(fn)
      if (key) {
        return !city[num].cityObject.includes(key)
      } else {
        return city[num]
      }
      function fn (num, numIndex, nums) {
        return num.companyId === local
      }
    }
  }
}
