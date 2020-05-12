const getters = {
  coordinate: state => state.user.coordinate,
  realname: state => state.user.realname,
  authRolesInfor: state => state.user.authRolesInfor,
  getCurCity: state => state.user.curCity,
  openedPageList: state => state.tagNav.openedPageList,
  savedPosition: state => state.tagNav.savedPosition,
  token: state => state.auth.token,
  machineCode: state => state.auth.machineCode,
  navList: state => state.auth.navList,
  housePurpose: state => state.house.housePurpose,
  // 调用方式 computed doneTodos () { return this.$store.getters.getDictByCode('qq') }
  getDictByCode: (state) => (code) => {
    return state.config.dictionaryList.filter(item => item.code === code)
  },
  /**
   * 根据parentCode, parentKey取数据字典
   * @param {Objece[]} [state] - 获取数据字典默认参数
   * @param {string} parentCode - 根据数据字典获取的值
   * @param {string} parentKey - 获取的值
   * @param {string} code - 所使用的数据字典
   */
  getDictByParentCode: (state) => (parentCode, parentKey, code) => {
    return state.config.dictionaryList.filter(item => item.parentCode === parentCode && item.parentKey === parentKey && item.code === code)
  },
  // 根据key获取value
  getValueByCode: (state) => (code, key) => {
    const list = state.config.dictionaryList.filter(item => item.code === code)
    return list.filter(item => item.key === key).length > 0 ? list.filter(item => item.key === key)[0].value : ''
  },
  ossDomain: state => state.config.ossDomain,
  // 获取人员tree
  PersonnelList: state => state.config.PersonnelList,
  // 获取门店tree
  StoreList: state => state.config.StoreList,
  // 获取楼盘tree
  BuildList: state => state.config.BuildList,
  getOrgNameByCode: (state) => (code) => {
    const orgList = state.config.organizationList.filter(item => item.code === code)
    if (orgList && orgList.length > 0) {
      return orgList[0].name
    }
    return ''
  },
  getOrgNameWithParentByCode: (state) => (code) => {
    const orgList = state.config.organizationList.filter(item => item.code === code)
    if (orgList && orgList.length > 0) {
      const orgName = orgList[0].name
      const parentOrgList = state.config.organizationList.filter(item => item.code === orgList[0].parentCode)
      if (parentOrgList && parentOrgList.length > 0) {
        return parentOrgList[0].name + '/' + orgName
      } else {
        return orgName
      }
    }
    return ''
  },
  getPositionNameByCode: (state) => (code) => {
    if (code) {
      const posList = state.config.positionList.filter(item => item.code === code)
      if (posList && posList.length > 0) {
        return posList[0].name
      }
    }
    return ''
  },
  // 判断水印
  getWaterMark: (state) => (code, addTime) => {
    if (addTime && state.user.companyId === 104) {
      var nowDate = new Date(addTime).getTime()
      var smallDate = new Date('2019-03-15 17:00:00').getTime()
      var bigDate = new Date('2019-03-28 02:00:00').getTime()
      if (nowDate >= smallDate && nowDate <= bigDate) return code
    }
    if (code) {
      const textWaterMark = '?x-oss-process=image/watermark,image_c2FsZS9zdGF0aWMvbG9nb190cmFuc3BhcmVuY3kucG5n,g_center'
      return code.indexOf('http://resource-phyd.oss-cn-shanghai.aliyuncs.com') === -1 ? code + state.user.watermark : code + textWaterMark
    }
    return ''
  },
  // 下载加水印
  getWaterMark_downLoad: (state) => (url, addTime) => {
    if (addTime && state.user.companyId === 104) {
      var nowDate = new Date(addTime).getTime()
      var smallDate = new Date('2019-03-15 17:00:00').getTime()
      var bigDate = new Date('2019-03-28 02:00:00').getTime()
      if (nowDate >= smallDate && nowDate <= bigDate) return url
    }
    if (url) {
      if (url.indexOf(state.user.watermark) !== -1) {
        return url.replace(state.user.watermark, state.user.watermark_load)
      } else if (url.indexOf('?x-oss-process=image/watermark,image_c2FsZS9zdGF0aWMvbG9nb190cmFuc3BhcmVuY3kucG5n,g_center') !== -1) {
        return url.replace('?x-oss-process=image/watermark,image_c2FsZS9zdGF0aWMvbG9nb190cmFuc3BhcmVuY3kucG5n,g_center', '?x-oss-process=image/watermark,text_5Lit546v5Zyw5Lqn,type_ZmFuZ3poZW5naGVpdGk,color_ffffff,size_50,g_center,t_75,x_10,y_10')
      }
    }
    return ''
  }
}
export default getters
