import axios from 'axios'
// import qs from 'qs'
const pending = {}
const CancelToken = axios.CancelToken
const removePending = (key, isRequest = false) => {
  if (pending[key] && isRequest) {
    pending[key]('取消重复请求')
  }
  delete pending[key]
}
const getRequestIdentify = (config, isRequest = false) => {
  let url = config.url
  if (isRequest) {
    url = config.baseURL + config.url.substring(1, config.url.length)
  }
  return config.method === 'get' ? encodeURIComponent(url + JSON.stringify(config.params)) : encodeURIComponent(config.url + JSON.stringify(config.data))
}

// 请求拦截器
axios.interceptors.request.use(config => {
  // 拦截重复请求(即当前正在进行的相同请求)
  const requestData = getRequestIdentify(config, true)
  removePending(requestData, true)

  config.cancelToken = new CancelToken((c) => {
    pending[requestData] = c
  })

  return config
}, error => {
  return Promise.reject(error)
})

// 异常处理
axios.interceptors.response.use(response => {
  // 把已经完成的请求从 pending 中移除
  const requestData = getRequestIdentify(response.config)
  removePending(requestData)

  return {
    code: response.status,
    message: response.statusText,
    data: response.data
  }
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '错误请求'
        break
      case 401:
        err.message = '未授权，请重新登录'
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        err.message = '请求错误,未找到该资源'
        break
      case 405:
        err.message = '请求方法未允许'
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器端出错'
        break
      case 501:
        err.message = '网络未实现'
        break
      case 502:
        err.message = '网络错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网络超时'
        break
      case 505:
        err.message = 'http版本不支持该请求'
        break
      default:
        err.message = `连接错误${err.response.status}`
    }
    const errData = {
      code: err.response.status,
      message: err.message
    }
    // 统一错误处理可以放这，例如页面提示错误...
    console.log('统一错误处理: ', errData)
  }

  return Promise.reject(err)
})

axios.defaults.baseURL = 'http://localhost:8080'
export const HTTP = axios.create()
/**
 * Ajax 异步数据请求
 * @author nianguowei
 * @param type [String] e.g.:"POST" or "GET"
 * @param url [String] 请求url
 * @param param [Object] 参数
 * @param successFunction [Function] 成功回调函数
 * @param beforeFun [Function] 调用之前，可以用于loading
 * @param completeFun [Function] ajax执行完成，可以用于loading
 */
export default {
  install (Vue) {
    // Vue.prototype.baseURL = function () {
    //   return store.state.user.ip
    // }
    // Vue.prototype.staticURL = function () {
    //   return store.state.user.staticIp
    // }
    Vue.prototype.get = (url, param, successFun, errorFun) => {
      Vue.prototype.http('get', url, param, successFun, errorFun)
    }

    Vue.prototype.post = (url, param, successFun, errorFun) => {
      Vue.prototype.http('post', url, param, successFun, errorFun)
    }

    Vue.prototype.delete = (url, param, successFun, errorFun) => {
      Vue.prototype.http('delete', url, param, successFun, errorFun)
    }

    Vue.prototype.put = (url, param, successFun, errorFun) => {
      Vue.prototype.http('put', url, param, successFun, errorFun)
    }

    Vue.prototype.export = (url, param, successFun, errorFun) => {
      const token = 'store.getters["token"]'
      const machineCode = 'store.getters["machineCode"]'
      const header = {
        Authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded'
      }
      if (machineCode) {
        header.machineCode = machineCode
      }
      HTTP({
        method: 'post',
        url: url,
        data: param,
        dataType: 'json',
        headers: header,
        contentType: 'application/json',
        responseType: 'blob'
      }).then(successFun)
        .catch(errorFun)
    }
    Vue.prototype.http = (method, url, param, successFun, errorFun) => {
      // let token = 'store.getters["token"]'
      // let machineCode = 'store.getters["machineCode"]'
      // let headers = {
      //   'Authorization': 'Bearer ' + token
      // }
      // if (machineCode) {
      //   headers.machineCode = machineCode
      // }
      // let newUrl = Vue.prototype.urlFormmter(url)
      HTTP({
        method: method,
        url: url,
        data: param,
        dataType: 'json',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        contentType: 'application/json'
      }).then(successFun)
        .catch(errorFun)
    }
    // 微信专用
    // HTTP.defaults.adapter = (config) => {
    //   return new Promise((resolve, reject) => {
    //     let data = config.method === 'get' ? config.params : qs.stringify(config.data)
    //     // wx小程序 发起请求相应 log 就可以看到熟悉的返回啦
    //     uni.request({
    //       url: config.url,
    //       method: config.method,
    //       data: data,
    //       success: (res) => {
    //         return resolve(res)
    //       },
    //       fail: (err) => {
    //         return reject(err)
    //       }
    //     })
    //   })
    // }
  }
}
