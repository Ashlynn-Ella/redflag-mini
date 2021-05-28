// packageA/pages/my/index.js
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: ''
  },
  async initUser() {
    const detail = await app.queryClient('GET', `${app.globalData.baseUrl}/user/detail`)
    this.setData({
      user: { ...detail.result }
    })
  },
  async logout() {
    const res = await app.queryClient('GET', `${app.globalData.baseUrl}/user-token/reset`)
    if (res.result) {
      wx.removeStorage({
        key: 'X-Access-Token',
        success(res) {
          Toast.success('退出登录成功')
        }
      })
      wx.navigateTo({
        url: "/packageA/pages/login/index"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  goEditing(e) {
    const { editname } = e.currentTarget.dataset;
    console.log(this.data.user)
    wx.navigateTo({
      url: `/packageA/pages/editing/index?editname=${editname}`,
      success: (res) => {
        res.eventChannel.emit('user', { data: this.data.user })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initUser()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initUser()
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