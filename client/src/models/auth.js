const token = JSON.parse(localStorage.getItem('token'));

export default {
  namespace: 'auth',
  // 初始化的state
  state: {
    ...token,
  },
  reducers: {
    // 票据过期，更新state,让isAuth为false
    expire(state) {
      return {
        ...state,
        isAuth: false,
      };
    },

    // 登入成功，更新票据
    login(state, { payload }) {
      return {
        ...payload,
      };
    },

    // 退出登入，删除token, 并清空state
    logout() {
      localStorage.removeItem('token');
      return {};
    },
  },
  effects: {},
  subscriptions: {},
};
