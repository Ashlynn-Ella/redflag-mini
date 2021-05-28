//app.js
import Toast from '@vant/weapp/toast/toast';

App({
  onLaunch: function () {
    this.globalData = {
      baseUrl: 'https://aiot.chinaredflag.cn/api',
      url: 'https://aiot.chinaredflag.cn/php',
    }
  },
  http(method, url, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        method: method,
        url,
        data,
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          resolve(res)
        },
        fail() {
          reject({
            message: '请求失败'
          })
        }
      }
      )
    })
  },

  client(method, url, data = {}) {
    try {
      var value = wx.getStorageSync('X-Access-Token')
      if (value) {
        return new Promise((resolve, reject) => {
          wx.request({
            method,
            url,
            data,
            header: {
              'content-type': 'application/json',
              'X-Access-Token': value
            },
            success(res) {
              resolve(res)
            },
            fail() {
              reject({
                message: '请求失败'
              })
            }
          })
        })
      } else {
        wx.navigateTo({
          url: "/packageA/pages/login/index"
        })
      }
    } catch (e) {
      console.log(e)
    }
  },
  //处理数据
  async queryClient(method, url, data = {}) {
    const res = await this.client(method, url, data)
    if (res) {
      if (res.data.status === 401) {
        wx.removeStorage({
          key: 'X-Access-Token',
          success(res) {
            console.log(res)
          }
        })
        wx.navigateTo({
          url: "/packageA/pages/login/index"
        })
      } else if (res.data.status === 200) {
        return res.data
      } else {
        return res.data
      }
    } else {
      return Promise.reject('发送请求失败')
    }
  },
  //获取所有棚室
  async queryAllDevice() {
    const url = `${this.globalData.baseUrl}/device-instance/_query`
    const res = await this.queryClient('GET', url, { pageSize: 200 })
    return res.result
  },

  //获取属性
  async queryProps(deviceId) {
    const url = `${this.globalData.baseUrl}/api/v1/device/${deviceId}/_detail`
    const res = await this.queryClient('GET', url)
    return res.result
  },

  //格式化属性
  formatProps(obj) {
    let props = JSON.parse(obj).properties;
    let list = []
    props.forEach(item => {
      list.push({ text: item.name, value: item.id, unit: item.valueType.unit })
    })
    return list
  }
})
