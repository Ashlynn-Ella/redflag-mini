// packageA/pages/add/index.js
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    username: '',
    password: '',
    confirm: ''
  },
  addUser() {
    const { name, username, password, confirm } = this.data
    wx.getStorage({
      key: 'X-Access-Token',
      success: (res) => {
        app.http('POST', `${app.globalData.url}/usersave.php?token=${res.data}`, {
          name, username, password, confirm
        }).then(res => {
          if (res.data.result) {
            Toast.success('添加用户成功')
            wx.navigateTo({
              url: '/packageA/pages/admin/index'
            })
          } else {
            Toast.fail(res.data.message)
          }
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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