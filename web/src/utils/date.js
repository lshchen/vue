/* eslint-disable */
function leadingZero (time) {
  return Number(time) < 10 ? `0${time}` : time
}
Date.prototype.getWeek = function () {
	let theMonForWeek = new Date(this.setHours(0, 0, 0, 0))
  let theCurrentMonCopy = new Date(this.setHours(0, 0, 0, 0))
  const theSunWithDateForWeek = theMonForWeek.getDate() - 1
  let valToLocaleDate = (time) => new Date(time).toLocaleDateString().split('/')
  
	// Grabbing Start/End Dates
	let StartDate = valToLocaleDate(theMonForWeek.setDate(theSunWithDateForWeek))
  let EndDate = valToLocaleDate(theCurrentMonCopy.setDate(theSunWithDateForWeek + 6))
  
  let outPutDate = [StartDate[0] + '-' + leadingZero(StartDate[1]) + '-' + leadingZero(StartDate[2]), EndDate[0] + '-' + leadingZero(EndDate[1]) + '-' + leadingZero(EndDate[2])]
	return outPutDate
}

import moment from 'moment'
/**
 * 时间日期工具类
 */
export default{
  install (Vue) { // eslint-disable-line no-mixed-spaces-and-tabs
    /**
     * 转换日期对象格式为yyyy-MM-dd的日期字符串
     *
     * @param date 日期
     * @return 日期字符串
     */
    Vue.prototype.getFormatDate = (date) => {
      if (date) {
        return moment(date).format('YYYY-MM-DD')
      }
      return ''
    }
    /**
     * 转换日期对象格式为YYYY年MM月DD日的日期字符串
     *
     * @param date 日期
     * @return 日期字符串
     */
    Vue.prototype.getChineseDate = (date) => {
      if (date) {
        return moment(date).format('YYYY年MM月DD日')
      }
      return ''
    }

    /**
     * 转换日期对象格式为yyyy-MM-dd的日期字符串
     *
     * @param date 日期
     * @return 日期字符串
     */
    Vue.prototype.getFormatDateWithFormat = (date, format) => {
      if (date) {
        return moment(date).format(format)
      }
      return ''
    }

    /**
     * 转换日期对象格式为YYYY-MM-DD HH:mm:ss的日期时间字符串
     *
     * @param date 日期时间
     * @return 日期时间字符串
     */
    Vue.prototype.getFormatDateTime = (date) => {
      if (date) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
      return ''
    }
    /**
     * 转换日期对象格式为YYYY年MM月DD日 HH时mm分ss秒的日期时间字符串
     *
     * @param date 日期时间
     * @return 日期时间字符串
     */
    Vue.prototype.getFormatDateTimeOfChinese = (date) => {
      if (date) {
        return moment(date).format('YYYY年MM月DD日 HH时mm分ss秒')
      }
      return ''
    }

    /**
     * 转换日期对象格式为ISO 8601格式的日期时间字符串
     *
     * @param date 日期时间
     * @returns 日期时间字符串
     */
    Vue.prototype.getFormatDateTimeISO = (date) => {
      if (date) {
        return moment(date).format('YYYY-MM-DDTHH:mm:ss+08')
      }
      return ''
    }

    Vue.prototype.getDayBefore = (date, day, formatStr) => {
      if (date) {
        if (formatStr) {
          return moment(date).subtract(day, 'days').format(formatStr)
        } else {
          return moment(date).subtract(day, 'days').format('YYYY-MM-DD')
        }
      }
      return ''
    }
    Vue.prototype.getMonthBefore = (date, month, formatStr) => {
      if (date) {
        if (formatStr) {
          return moment(date).subtract(month, 'months').format(formatStr)
        } else {
          return moment(date).subtract(month, 'months').format('YYYY-MM')
        }
      }
      return ''
    }
    Vue.prototype.getYearBefore = (date, year, formatStr) => {
      if (date) {
        if (formatStr) {
          return moment(date).subtract(year, 'years').format(formatStr)
        } else {
          return moment(date).subtract(year, 'years').format('YYYY')
        }
      }
      return ''
    }
    Vue.prototype.getUnixToYear = (date) => {
      if (date) {
        if (date !== '0') {
          date = date.toString()
          if (date.length <= 10) {
            if (date.length <= 4) {
              return date
            }
            date = date + '000'
          }
          var curDate = new Date(Number(date))
          return curDate.getFullYear()
        } else {
          return ''
        }
      }
      return ''
    }
    Vue.prototype.toCompare = (startDate, endDate, day) => {
      if (day) {
        var sDate = new Date(startDate).getTime()
        var eDate = new Date(endDate).getTime()
        var thisMothDays = 1000 * 3600 * 24 * Number(day)
        if (eDate - sDate > thisMothDays) {
          return true
        } else {
          return false
        }
      }
      return ''
    }
    Vue.prototype.getBeforeMonth = () => {
      let d = new Date()
      d = d - 1000 * 60 * 60 * 24 * 29
      d = new Date(d)
      let year = d.getFullYear()
      let mon = d.getMonth() + 1
      let day = d.getDate()
      let s = year + '-' + leadingZero(mon) + '-' + leadingZero(day)
      return s
    }
    Vue.prototype.getHalfMoon = () => {
      let d = new Date()
      d = d - 1000 * 60 * 60 * 24 * 15
      d = new Date(d)
      let year = d.getFullYear()
      let mon = d.getMonth() + 1
      let day = d.getDate()
      let s = year + '-' + leadingZero(mon) + '-' + leadingZero(day)
      return s
    }
    Vue.prototype.sizeCompare = (startDate, endDate) => {
      var sDate = new Date(startDate).getTime()
      var eDate = new Date(endDate).getTime()
      if (sDate - eDate > 0) {
        return true
      } else {
        return false
      }
    }
    Vue.prototype.formatDate = (date) => {
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      let d = date.getDate()
      return y + '-' + leadingZero(m) + '-' + leadingZero(d)
    }
    Vue.prototype.getCurrentMonthFirst = (d) => {
      var date = new Date(d)
      date.setDate(1)
      return Vue.prototype.formatDate(date)
    }
    Vue.prototype.getCurrentMonthLast = (d) => {
      var date = new Date(d)
      var currentMonth = date.getMonth()
      var nextMonth = ++currentMonth
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
      var oneDay = 1000 * 60 * 60 * 24
      return Vue.prototype.formatDate(new Date(nextMonthFirstDay - oneDay))
    }
    Vue.prototype.getFirstDayOfYear = (d) => {
      var date = new Date(d)
      date.setMonth(0)
      date.setDate(1)
      return Vue.prototype.formatDate(date)
    }
    Vue.prototype.getLastDayOfYear = (d) => {
      var date = new Date(d)
      date.setMonth(11)
      date.setDate(31)
      return Vue.prototype.formatDate(date)
    }
  }
}
