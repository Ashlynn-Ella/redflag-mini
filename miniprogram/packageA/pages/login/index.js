// packageA/pages/login/index.js
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "",
    verifyKey: "",
    username: "",
    verifyCode: "",
    password: "",
    expires: 3600000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCode()
  },
  getCode() {
    const url = `${app.globalData.baseUrl}/authorize/captcha/image?width=130&height=40`
    app.http('GET', url).then(res => {
      const result = res.data.result
      this.setData({
        imgUrl: result.base64,
        verifyKey: result.key
      })
    })
  },
  login() {
    const url = `${app.globalData.baseUrl}/authorize/login`
    const { username, password, verifyCode, verifyKey, expires } = this.data
    app.http('POST', url, {
      username,
      password,
      verifyCode,
      verifyKey,
      expires,
      tokenType: "default"
    }).then(res => {
      if (res.data.status === 200) {
        Toast.success("登录成功")
        wx.setStorage({
          key: "X-Access-Token",
          data: res.data.result.token
        })
        wx.switchTab({
          url:'/pages/index/index'
        })
      } else {
        Toast.fail(res.data.message)
        this.getCode()
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getCode()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})