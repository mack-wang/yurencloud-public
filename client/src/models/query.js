
export default {
  namespace: 'query',
  state: { // 这个model 就是用来组织多参数查询的查询语句的
    page: 1,
    pageSize: 10,
  },
  reducers: {
    update(state, { payload }) {
      return { ...state, ...payload };
    },
    reset() {
      return {
        page: 1,
        pageSize: 10,
      };
    },
    init(state, { payload }) {
      return {
        ...state,
        ...payload,
        page: 1,
        pageSize: 10,
      };
    },
  },
  effects: {},
  subscriptions: {},
};
