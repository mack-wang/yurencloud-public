import { create, getAll, getOne, modify, deletes, recommend, top } from 'services/article';
import { routerRedux } from 'dva/router';
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { message } from 'antd';

export default {
  namespace: 'article',
  state: {
    reset: false,
    pageInfo: {},
    article: {},
    modify: false,
    editorState: EditorState.createEmpty(),
    cascader: [],
    fileList: undefined,
    title: '',
    search: '',
    cascaderValue: [],
  },
  reducers: {
    reset(state) {
      return { ...state, ...{ reset: !state.reset } };
    },
    update(state, { payload }) { // payload是包裹在action中的，所以不能直接展开
      return { ...state, ...payload };
    },
    init() {
      return {
        reset: false,
        pageInfo: {},
        article: {},
        modify: false,
        editorState: EditorState.createEmpty(),
        cascader: [],
        fileList: undefined,
        title: '',
        search: '',
        cascaderValue: [],
      };
    },
  },
  effects: {
    // 创建新文章
    *submit({ payload }, { call, put }) {
      const { content } = yield call(create, payload);
      yield put({ type: 'reset' });
      message.success(content, 3);
    },

    *modifySubmit({ payload }, { call, put, select }) {
      payload.id = yield select(state => state.article.article.id);
      const { content } = yield call(modify, payload);
      yield put({ type: 'update', payload: { modify: false } });
      yield put(routerRedux.push('/admin/article/list'));
      message.success(content);
    },

    // 获取文章分页
    *getAll({ payload }, { call, put, select }) {
      const query = yield select(state => state.query);
      const { data } = yield call(getAll, query);
      yield put({ type: 'update', payload: { pageInfo: data } });
    },

    // 修改文章
    *modify({ payload }, { call, put }) {
      const { data } = yield call(getOne, payload);
      // 原先的convertFromHTML会导致style样式丢失，只剩下文本
      const blocksFromHtml = htmlToDraft(data.content);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      const editorState = EditorState.createWithContent(contentState);
      const cascader = [data.catalog.gid, data.catalog.pid, data.catalogId];
      let fileList;
      if (data.image) {
        fileList = [{
          uid: -1,
          name: '标题图.png',
          status: 'done',
          url: data.image,
          thumbUrl: data.image,
        }];
      }

      yield put({ type: 'update',
        payload: {
          article: data,
          modify: true,
          editorState,
          cascader,
          fileList,
        },
      });
    },

    // 删除文章
    *deletes({ payload }, { call, put }) {
      // 删除
      const { content } = yield call(deletes, payload);
        // 重新加载文章
      yield put({ type: 'getAll' });
      message.success(content);
    },

    // 推荐
    *recommend({ payload }, { call, put }) {
      const { content } = yield call(recommend, payload);
      // 重新加载文章
      yield put({ type: 'getAll' });
      message.success(content);
    },

    // 置顶
    *top({ payload }, { call, put }) {
      const { content } = yield call(top, payload);
        // 重新加载文章
      yield put({ type: 'getAll' });
      message.success(content);
    },

  },
  subscriptions: {
  },
};
