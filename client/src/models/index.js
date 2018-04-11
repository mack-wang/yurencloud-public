import { getMenu, getArticles, getArticle, getCatalog, isLike, setLike } from 'services/index';
import { setView } from 'services/article';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'index',
  state: {
    menu: [],
    articles: {},
    showArticle: false,
    article: {},
    catalog: {},
    defaultMenu: '2',
    like: false,
    variable: 0,
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    // 获取首页目录
    * getMenu({ payload }, { call, put }) {
      if (isNaN(payload.id)) return;
      const { data } = yield call(getMenu, payload);
      const menu = makeMenu(data);
      yield put({
        type: 'update',
        payload: {
          menu,
          openKeys: [`${menu[0].value}`],
          selectedKeys: [`${menu[0].children[0].value}`],
        },
      });
    },
    // 获取当前菜单目录的，第一个目录的所有文章
    * getArticles({ payload }, { call, put, select }) {
      const query = yield select(state => state.query);
      const { data } = yield call(getArticles, query);
      yield put({ type: 'update', payload: { articles: data } });
      yield put(routerRedux.push('/'));
    },
    // 根据id获取公开文章
    * getArticle({ payload }, { call, put, select }) {
      // 先增加文章浏览数量
      yield call(setView, payload.id);
      // 判断用户是否已经登入，获取文章是否已经被喜欢
      const isAuth = yield select(state => state.auth.isAuth);
      if (isAuth) {
        const { data } = yield call(isLike, payload.id);
        yield put({ type: 'update', payload: { like: data === 1 } });
      }
      const { data } = yield call(getArticle, payload.id);
      yield put({ type: 'update', payload: { article: data } });
    },

    // 根据文章id获取这个文章所在的的目录
    * getCatalog({ payload }, { call, put }) {
      const { data } = yield call(getCatalog, payload.id);
      yield put({ type: 'update', payload: { catalog: data } });
    },

    // 设置喜欢文章或者取消喜欢文章
    * setLikes({ payload }, { call, put, select }) {
      const isAuth = yield select(state => state.auth.isAuth);
      if (isAuth) {
        const { data } = yield call(setLike, payload.id);
        if (data === 0) {
          yield put({ type: 'update', payload: { like: true, variable: 1 } });
        } else {
          yield put({ type: 'update', payload: { like: false, variable: -1 } });
        }
      } else {
        // 若没授权，则去登入
        yield put(routerRedux.push('/login'));
      }
    },

    * goArticle({ payload }, { put }) {
      yield put(routerRedux.push(`/article/${payload.id}`));
    },
  },
  subscriptions: {},
};


function makeMenu(data) {
  const arr = [];
  data.map((item) => {
    // 构造一级菜单
    if (item.level === 1) {
      const obj = {
        value: item.id,
        label: item.name,
        children: [],
      };
      data.map((item2) => {
        // 构造二级菜单
        if (item2.level === 2 && obj.value === item2.pid) {
          const obj2 = {
            value: item2.id,
            label: item2.name,
          };
          obj.children.push(obj2);
        }
      });
      arr.push(obj);
    }
  });
  return arr;
}
