// packageA/pages/admin/index.js
const app = getApp();
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    name: '',
    users: [],
    loading: true
  },

  getUsers() {
    this.setData({
      loading: true
    })
    wx.getStorage({
      key: 'X-Access-Token',
      success: (res) => {
        app.http(
          "GET",
          `${app.globalData.url}/users.php?token=${res.data}&name=${this.data.name}`
        ).then(res => {
          if (res) {
            this.setData({
              users: res.data.data,
              loading: false
            })
          }
        })
      }
    })
  },
  changeStatus(e) {
    const id = e.currentTarget.dataset.id
    const status = e.currentTarget.dataset.status ? 0 : 1
    wx.getStorage({
      key: 'X-Access-Token',
      success: (res) => {
        Dialog.confirm({
          title: '提示',
          message: `确定${status ? '启用' : '禁用'}该用户吗？`,
          showCancelButton: true
        }).then(() => {
          app.http(
            "POST",
            `${app.globalData.url}/usersave.php?token=${res.data}`,
            {
              id,
              status
            }
          ).then(res => {
            if (res.data.result === true) {
              this.getUsers()
            } else {
              Toast.fail(res.data.message)
            }
          })
        }).catch(() => {

        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  editUser(e) {
    const user = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/packageA/pages/edit/index`,
      success: (res) => {
        res.eventChannel.emit('user', { data: user })
      }
    })
  },
  searchChange(event) {
    this.setData({
      name: event.detail
    })
    this.getUsers()
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getUsers()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUsers()
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
    this.getUsers()
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