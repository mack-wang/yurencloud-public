import { message } from 'antd';
import * as loginService from 'services/login';
import jwtDecode from 'jwt-decode';

export default {
  namespace: 'login',
  state: {},
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    * login({ payload }, { put, call }) {
      // 把用户名和密码组成json发送给login去验证，获取 {token:xxxxx};
      const { username, password, pathname } = payload;
      const { success, result, data } = yield call(loginService.login, { username, password });
      if (success && result) {
        // 判断是否验证成功
        if (data) {
          const token = data;
          // 保存token到本地
          // 全局以这个auth为授权标准，若token过期，则把这个auth从本地删除，然后跳转到登入页
          // 就算有人伪造也没关系，因为token值造不出来
          const authority = [];
          if (token) {
            const decode = jwtDecode(token);
            decode.authority.map(item => authority.push(item.authority));
          }

          const auth = { token, username, authority, isAuth: true };
          localStorage.setItem('token', JSON.stringify(auth));
          // 更新授权
          yield put({ type: 'auth/login', payload: auth });
          // 登入home,如果是管理员，则登入到admin
          yield put({ type: 'home/login', payload: { pathname } });
        } else {
          message.error('用户名或密码错误！');
        }
      } else {
        message.error('用户名或密码错误！');
      }
    },
  },
  subscriptions: {},
};

