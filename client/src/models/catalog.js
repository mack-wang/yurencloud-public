import { catalog, catalogPage, modifyCatalog, deletes, off, createCatalog, catalogMenu } from 'services/catalog';
import { message } from 'antd';

export default {
  namespace: 'catalog',
  state: {
    catalog: [],
    catalogMenu: [],
    pageInfo: {},
    value: undefined,
    addonBefore: '修改',
    disable: true,
    action: 'none',
    id: 0,
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    reset(state) {
      return {
        ...state,
        value: undefined,
        addonBefore: '修改',
        disable: true,
        action: 'none',
        id: 0,
      };
    },
  },
  effects: {
    // 获取目录的级联列表
    *cascader({ payload }, { call, put }) {
      const { data } = yield call(catalog);
        // 更新
      yield put({ type: 'update', payload: { catalog: makeCascader(data) } });
    },

    // 获取目录的级联列表(除未定义的目录外)
    *cascaderMenu({ payload }, { call, put }) {
      const { data } = yield call(catalogMenu);
      // 更新
      yield put({ type: 'update', payload: { catalogMenu: makeCascader(data) } });
    },

    // 获取全部目录
    *allCatalog({ payload }, { call, put }) {
      const { data } = yield call(catalog);
      yield put({ type: 'update', payload: { allCatalog: makeAllCatalog(data) } });
    },

    // 获取目录的分页
    *catalogPage({ payload }, { call, put, select }) {
      const query = yield select(state => state.query);
      const { data } = yield call(catalogPage, query);
      yield put({ type: 'update', payload: { pageInfo: data } });
    },

    // 修改目录名称
    *modify({ payload }, { call, put, select }) {
      const { value, id, allCatalog } = yield select(state => state.catalog);
      if (value.length === 0) {
        return message.error('未填写目录名称');
      }
      const { content } = yield call(modifyCatalog, { name: value, id });
      yield put({ type: 'reset' });
      allCatalog[id].name = value;
      yield put({ type: 'update', payload: { allCatalog } });
      yield put({ type: 'catalogPage' });
      message.success(content);
    },
    // 删除目录
    *deletes({ payload }, { call, put }) {
      const { result, content } = yield call(deletes, payload);
      if (result) {
        message.success(content);
      } else {
        message.error(content);// 未定义目录不能删除
      }
      yield put({ type: 'catalogPage' });
    },

    // 关闭目录
    *off({ payload }, { call, put }) {
      const { content } = yield call(off, payload);
      yield put({ type: 'catalogPage' });
      message.success(content);
    },

    // 添加子目录
    *add({ payload }, { call, put, select }) {
      const { value, id } = yield select(state => state.catalog);
      if (value.length === 0) {
        return message.error('未填写目录名称');
      }
      const { content } = yield call(createCatalog, { name: value, id });
      yield put({ type: 'allCatalog' });
      yield put({ type: 'catalogPage' });
      message.success(content);
    },

    // 添加分类目录
    *create({ payload }, { call, put, select }) {
      const { value } = yield select(state => state.catalog);
      if (value.length === 0) {
        return message.error('未填写目录名称');
      }
      const { content } = yield call(createCatalog, { name: value });
      yield put({ type: 'allCatalog' });
      yield put({ type: 'catalogPage' });
      message.success(content);
    },

  },
  subscriptions: {},
};

function makeCascader(data) {
  const arr = [];
  data.map((item) => {
    // 构造一级菜单
    if (item.level === 0) {
      const obj = {
        value: item.id,
        label: item.name,
        children: [],
      };
      data.map((item2) => {
        // 构造二级菜单
        if (item2.level === 1 && obj.value === item2.pid) {
          const obj2 = {
            value: item2.id,
            label: item2.name,
            children: [],
          };
          data.map((item3) => {
            // 构造三级菜单
            if (item3.level === 2 && obj2.value === item3.pid) {
              const obj3 = {
                value: item3.id,
                label: item3.name,
              };
              obj2.children.push(obj3);
            }
          });
          obj.children.push(obj2);
        }
      });
      arr.push(obj);
    }
  });
  return arr;
}

function makeAllCatalog(data) {
  const obj = {};
  data.map((item) => {
    obj[item.id] = item;
  });
  return obj;
}
