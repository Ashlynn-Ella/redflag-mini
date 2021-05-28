// packageA/pages/editing/index.js
const app = getApp();
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    id: '',
    password: '',
    confirm: '',
    editname: '',
    radio: '',
    token: "",
    username: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('user', (res) => {
      let { id, name, role, username } = res.data
      const radio = role === '无' ? '' : role === '游客' ? '1' : '2'
      username = username ? username : ''
      this.setData({
        name,
        id,
        username,
        editname: options.editname,
        radio
      })
    })
  },
  editUser() {
    const { name, id, password, confirm, editname } = this.data
    let config = { name, id }
    if (editname === '1') {
      if (!password && !confirm) {
        return Toast.fail('密码修改不能为空')
      }
      if (password !== confirm) {
        return Toast.fail('两次密码不一样')
      }
      config.password = password
      config.confirm = confirm
    }
    app.http('POST', `${app.globalData.url}/usersave.php?token=${this.data.token}`, config)
      .then(res => {
        if (res.data.result === true) {
          console.log(res)
          Toast.success('修改用户成功')
          wx.navigateTo({
            url: '/packageA/pages/admin/index'
          })
        } else {
          Toast.fail(res.data.message)
        }
      })
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
    app.http('POST', `${app.globalData.url}/userbind.php?token=${this.data.token}&userId=${this.data.id}&userName=${this.data.username}&role=${this.data.radio}`)
      .then(res => {
        if (res.data.status === 1) {
          Toast.success(res.data.message)
        } else {
          Toast.fail(res.data.message)
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
    wx.getStorage({
      key: 'X-Access-Token',
      success: (res) => {
        this.setData({
          token: res.data
        })
      }
    })
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