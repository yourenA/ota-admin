import { query as queryUsers, queryCurrent } from '@/services/user';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      console.log('fetchCurrent')
      // const response = yield call(queryCurrent);
      const username = sessionStorage.getItem('username');
      const token = sessionStorage.getItem('token');
      if (username&&token) {
        yield put({
          type: 'saveCurrentUser',
          payload: {
            username,
            token
          },
        });
      }else{
        yield put(
          routerRedux.push({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }

    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
