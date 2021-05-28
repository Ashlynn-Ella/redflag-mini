//index.js
const app = getApp();
Page({
  data: {
    active: 0,
    wetherData: [
      {
        imgUrl: '/images/index/roomtemp.png',
        text: '湿度',
        value: '30℃',
        prop: 'CJ01_roomhumi01',
      },
      {
        imgUrl: '/images/index/roomtemp.png',
        text: '温度',
        value: '30℃',
        prop: "CJ01_roomtemp01"
      },
      {
        imgUrl: '/images/index/roomtemp.png',
        text: '光照',
        value: '30℃',
        prop: "CJ01_strength01"
      },
      {
        imgUrl: '/images/index/roomtemp.png',
        text: '风速',
        value: '30℃',
        prop: "CJ01_windsped01"
      },
      {
        imgUrl: '/images/index/roomtemp.png',
        text: '风向',
        value: '30℃',
        prop: "CJ01_winddire01"
      },
      {
        imgUrl: '/images/index/roomtemp.png',
        text: '实况',
        value: '30℃'
      }
    ],
    productId: '20201015170538',
    tabDevice: 'smart_01',
    multi: [],
    loading: true
  },
  onReady: function () {

  },
  onLoad: function () {
    wx.getStorage({
      key: 'X-Access-Token',
      success(res) {
      },
      fail() {
        wx.navigateTo({
          url: "/packageA/pages/login/index"
        })
      }
    })
  },
  async getMulti() {
    this.setData({
      loading: true
    })
    const url = `${app.globalData.baseUrl}/dashboard/_multi`
    const param = {
      dashboard: "device",
      object: this.data.productId,
      measurement: "properties",
      dimension: "history",
      params: { deviceId: `${this.data.tabDevice}`, history: 1 },
    };
    const res = await app.queryClient('POST', url, param)
    const _multi = res.result
    const list = []
    _multi.forEach((item, index) => {
      const multiValue = item.data.value
      this.data.wetherData.map(item => {
        if (item.prop === multiValue.property) {
          const name = item.text
          const url = `/images/index/${multiValue.property.slice(5, -2)}.png`
          list.push({ ...multiValue, name, url })
        }
      })
    })
    this.setData({
      multi: list,
      loading: false
    })
  },
  onPullDownRefresh: function () {
    this.getMulti()
    wx.stopPullDownRefresh()
  },
  onShow() {
    this.getMulti()
  },
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = `my-image${filePath.match(/\.[^.]+?$/)[0]}`
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
