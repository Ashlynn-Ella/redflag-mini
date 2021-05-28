// packageA/pages/edit/index.js
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('user', (res) => {
      this.setData({
        user: { ...res.data }
      })
    })   
  },

  deleteUser() {
    Dialog({
      title: '提示',
      message: `确定删除用户吗？`,
      showCancelButton: true
    }).then(() => {
      app.queryClient('DELETE', `${app.globalData.baseUrl}/user/${this.data.user.id}`).then(res => {
        if (res.result) {
          Toast.success('删除成功')
          wx.navigateTo({
            url: '/packageA/pages/admin/index'
          })
        } else {
          Toast.success(res.message)
        }
      }).catch(() => {

      })
    })
  },

  goEditing(e) {
    const { editname } = e.currentTarget.dataset;
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