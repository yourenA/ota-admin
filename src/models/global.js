import { queryNotices } from '@/services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      // const data = yield call(queryNotices);
      const data=[
        {
          id: '000000001',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '一号茶园土壤湿度异常',
          datetime: '2018-10-09',
          type: 'notification',
        },
        {
          id: '000000002',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '二号茶园土壤湿度异常',
          datetime: '2018-09-08',
          type: 'notification',
        },
        {
          id: '000000003',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '三号有机茶园温度异常',
          datetime: '2018-08-07',
          read: false,
          type: 'notification',
        },
        {
          id: '000000004',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '四号有机茶园温度异常',
          datetime: '2018-08-07',
          type: 'notification',
        },
        {
          id: '000000005',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '五号有机茶园温度异常',
          datetime: '2018-08-07',
          type: 'notification',
        },
        {
          id: '000000006',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '曲丽丽 评论了你',
          description: '描述信息描述信息描述信息',
          datetime: '2017-08-07',
          type: 'message',
        },
        {
          id: '000000007',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '朱偏右 回复了你',
          description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
          datetime: '2017-08-07',
          type: 'message',
        },
        {
          id: '000000008',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '标题',
          description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
          datetime: '2017-08-07',
          type: 'message',
        },
        {
          id: '000000009',
          title: '任务名称',
          description: '任务需要在 2017-01-12 20:00 前启动',
          extra: '未开始',
          status: 'todo',
          type: 'event',
        },
        {
          id: '000000010',
          title: '第三方紧急代码变更',
          description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
          extra: '马上到期',
          status: 'urgent',
          type: 'event',
        },
        {
          id: '000000011',
          title: '信息安全考试',
          description: '指派竹尔于 2017-01-09 前完成更新并发布',
          extra: '已耗时 8 天',
          status: 'doing',
          type: 'event',
        },
        {
          id: '000000012',
          title: 'ABCD 版本发布',
          description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
          extra: '进行中',
          status: 'processing',
          type: 'event',
        },
      ]
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
