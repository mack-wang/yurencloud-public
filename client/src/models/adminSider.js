
export default {
  namespace: 'adminSider',
  state: {
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
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const path = pathname.split('/');
        dispatch({ type: 'update', payload: { select: path[3], open: path[2] } });
      });
    },
  },
};
