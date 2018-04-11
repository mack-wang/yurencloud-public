import { profile } from 'services/home';
import { message } from 'antd';
import { routerRedux } from 'dva/router';


export default {
  namespace: 'home',
  state: {},
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    * login({ payload }, { put, call, select }) {
      // 从state树上获取auth列表
      const { token, authority } = yield select(state => state.auth);
      // 获取用户信息，返回home页面
      const { result, data } = yield call(profile, token);

      if (result) {
          // 获取用户的昵称和头像信息，然后显示home页面
        const { id, username, nickname, avatar } = data;
        yield put({ type: 'update', payload: { id, username, nickname, avatar } });
        if (payload.pathname === '/login') {
          if (authority.includes('ROLE_ADMIN')) {
            yield put(routerRedux.push('/admin/article/create'));
          } else {
            yield put(routerRedux.push('/home/index'));
          }
        } else {
          yield put(routerRedux.push(payload.pathname));
        }
      } else {
        yield put({ type: 'auth/expire' });
        message.error('登入过期，请重新登入！');
      }
    },
  },
  subscriptions: {},
};
