import { queryRule, removeRule, addRule, updateRule } from '@/services/api';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // const response = yield call(queryRule, payload);
      let tableListDataSource = [];
      for (let i = 0; i < 46; i += 1) {
        tableListDataSource.push({
          key: i,
          disabled: i % 6 === 0,
          href: 'https://ant.design',
          avatar: [
            'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
            'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
          ][i % 2],
          name: `设备 ${i}`,
          title: `一个任务名称 ${i}`,
          owner: '曲丽丽',
          desc: `茶园${Math.floor(Math.random() * 10) % 4}`,
          callNo: Math.floor(Math.random() * 1000),
          status: Math.floor(Math.random() * 10) % 4,
          updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
          createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
          progress: Math.ceil(Math.random() * 100),
        });
      }
      const response = {
        list: tableListDataSource,
        pagination: {
          total: tableListDataSource.length,
          pageSize:10,
          current: payload?parseInt(payload.currentPage, 10) :1,
        },
      };
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
