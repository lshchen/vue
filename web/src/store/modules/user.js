
const state = {
  username: '',
  realname: '',
  positionType: '',
  id: '',
  mobile: '',
  system: '',
  machineCodeKey: '',
  ip: '',
  dwIp: '',
  tradeImgIp: '',
  staticIp: 'https://resource-phyd.oss-cn-shanghai.aliyuncs.com/saletest',
  cityConfig: 'city-daily.json',
  curCity: '',
  companyId: '',
  lockTimes: '',
  coordinate: {
  },
  type: 0, // 是否是中环员工`0`是
  authRolesInfor: {},
  avatar: '', // 头像
  organizationList: [], // 当前用户的组织列表
  storeList: [], // 当前用户的门店列表
  isChangedPwd: true,
  homeStroke: '', // 首页营销线行程量化行程类型
  homeNoticeChange: '', // 首页公告tab页切换
  contractContent: [], // 各城市模板验证
  watermark: '', // 水印后缀
  watermark_load: '', // 下载水印后缀
  isNotHome: false
}

const mutations = {
  setGroupUserInfo: (state, data) => {
    if (data) {
      state.username = data.username // 本人
      state.realname = data.realname
      state.positionType = data.positionType // 2 店长
      state.id = data.id
      state.mobile = data.mobile
      state.system = data.system
      state.type = data.type
      state.authRolesInfor.roleCode = data.accountDetailVO.roleCode // 是否为店长
      state.authRolesInfor.organizationCode = data.accountDetailVO.organizationCode // 本部
      state.authRolesInfor.largeRegionCode = data.accountDetailVO.largeRegionCode // 本大区
      state.authRolesInfor.regionCode = data.accountDetailVO.regionCode // 本区
      state.authRolesInfor.storeNo = data.accountDetailVO.storeNo // 本店
      state.authRolesInfor.storeGroupId = data.accountDetailVO.storeGroupId // 本组
      state.authRolesInfor.username = data.accountDetailVO.username // 本人
      state.avatar = data.avatarOssKey
      state.authRolesInfor.currentOrganizationCode = data.accountDetailVO.currentOrganizationCode // 当前所在区域
      // 本人 dataOwner = username benzu dataStoreGroupId = storeGroupId
    } else {
      state.username = ''
      state.realname = ''
      state.id = ''
      state.system = ''
      state.type = 0
      state.positionType = 0
      state.authRolesInfor = {}
      state.avatar = ''
      state.companyId = ''
      state.authRolesInfor.homePath = '/'
    }
  },
  setUserInfo: (state, data) => {
    if (data) {
      state.username = data.username // 本人
      state.realname = data.realname
      state.positionType = data.positionType // 2 店长
      state.id = data.id
      state.mobile = data.mobile
      state.system = data.system
      state.type = data.type
      state.authRolesInfor.roleCode = data.accountDetailVO.roleCode // 是否为店长
      state.authRolesInfor.organizationCode = data.accountDetailVO.organizationCode // 本部
      state.authRolesInfor.largeRegionCode = data.accountDetailVO.largeRegionCode // 本大区
      state.authRolesInfor.regionCode = data.accountDetailVO.regionCode // 本区
      state.authRolesInfor.storeNo = data.accountDetailVO.storeNo // 本店
      state.authRolesInfor.storeGroupId = data.accountDetailVO.storeGroupId // 本组
      state.authRolesInfor.username = data.accountDetailVO.username // 本人
      state.avatar = data.avatarOssKey
      state.authRolesInfor.currentOrganizationCode = data.accountDetailVO.currentOrganizationCode // 当前所在区域
      // 本人 dataOwner = username benzu dataStoreGroupId = storeGroupId
    } else {
      state.username = ''
      state.realname = ''
      state.id = ''
      state.mobile = ''
      state.system = ''
      state.type = 0
      state.positionType = 0
      state.authRolesInfor = {}
      state.avatar = ''
      state.companyId = ''
      state.authRolesInfor.homePath = '/'
    }
  },
  setIp (state, ip) {
    state.ip = ip
  },
  setMobile (state, mobile) {
    state.mobile = mobile
  },
  setLockTimes (state, lockTimes) {
    state.lockTimes = lockTimes
  },
  setMachineCodeKey (state, machineCodeKey) {
    state.machineCodeKey = machineCodeKey
  },
  setDwIp (state, dwIp) {
    state.dwIp = dwIp
  },
  setTradeImgIp (state, tradeImgIp) {
    state.tradeImgIp = tradeImgIp
  },
  setCoordinate (state, coordinate) {
    state.coordinate = coordinate
  },
  setWatermark (state, watermark) {
    state.watermark = watermark
  },
  setWatermark_load (state, watermarkLoad) {
    state.watermark_load = watermarkLoad
  },
  setContractContent (state, contractContent) {
    state.contractContent = contractContent
  },
  setStaticIp (state, ip) {
    state.staticIp = ip
  },
  setCurCity (state, city) {
    state.curCity = city
  },
  setCompanyId (state, companyId) {
    state.companyId = companyId
  },
  setOrganizationList (state, list) {
    state.organizationList = list
  },
  setStoreList (state, list) {
    state.storeList = list
  },
  setChangePwd (state, changeValue) {
    state.isChangedPwd = changeValue
  },
  setHomeStroke (state, changeValue) {
    state.homeStroke = changeValue
  },
  setHomeNoticeChange (state, changeValue) {
    state.homeNoticeChange = changeValue
  },
  setIsNotHome (state, changeValue) {
    state.isNotHome = changeValue
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
