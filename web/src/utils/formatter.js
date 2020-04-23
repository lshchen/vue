
/**
 * 格式化显示
 */
export default{
  install (Vue) {
    /**
       * 返回性别
       * @param date
       * @param format
       * @returns {string}
       */
    Vue.prototype.genderFormat = (data) => {
      data = data.toString()
      if (!data) {
        return ''
      }
      if (data === '1') {
        return '男'
      } else {
        return '女'
      }
    } // genderFormat
    /**
     * 返回相关枚举匹配结果
     * @param {string} val - 需要匹配的字段值
     * @param {Object[]} name - 待匹配的枚举类名
     */
    Vue.prototype.enumFormat = (val, name) => {
      if (!(val === undefined || val === null)) {
        val = val.toString()
        if (!val) {
          return ''
        } else {
          if (name.findIndex(item => item.value.toString() === val) === -1) {
            return ''
          } else {
            let getVal = name.find(item => item.value.toString() === val)
            return getVal.label
          }
        }
      }
    } // enumFormat

    Vue.prototype.houseStatusTableFormatter = function (row, column, cellValue, index) {
      if (cellValue === 1) {
        return '有效'
      } else if (cellValue === 2) {
        return '无效'
      } else if (cellValue === 3) {
        return '暂缓'
      } else if (cellValue === 4) {
        return '他售'
      } else if (cellValue === 5) {
        return '我售'
      } else if (cellValue === 6) {
        return '封盘'
      }
    }
    Vue.prototype.rentHouseStatusTableFormatter = function (row, column, cellValue, index) {
      if (cellValue === 1) {
        return '有效'
      } else if (cellValue === 2) {
        return '无效'
      } else if (cellValue === 3) {
        return '暂缓'
      } else if (cellValue === 4) {
        return '他租'
      } else if (cellValue === 5) {
        return '我租'
      }
    }
    Vue.prototype.houseTypeFormatter = function (row, column, cellValue, index) {
      if (cellValue === 1) {
        return '出售'
      } else if (cellValue === 2) {
        return '出租'
      }
    }
    Vue.prototype.houseTypeTableFormatter = function (row, column, cellValue, index) {
      if (cellValue === 1) {
        return '私盘'
      } else if (cellValue === 2) {
        return '区域精选'
      } else if (cellValue === 3) {
        return '公盘'
      }
    }
    Vue.prototype.rentHouseTypeTableFormatter = function (row, column, cellValue, index) {
      if (cellValue === 1) {
        return '私盘'
      } else if (cellValue === 2) {
        return '公盘'
      }
    }
  }
}
