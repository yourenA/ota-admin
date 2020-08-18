import { query,add,remove,edit ,editStatus,resetPassword,exportCSV } from '@/services/device_history_data';

export default {
  namespace: 'device_history_data',
  state: {
    data:[],
    meta: {total: 0, per_page: 0},
    loading: true,

  },
  effects: {
    *fetch({ payload,callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(query, payload);
      console.log(response)
      if(response.status===200){
        yield put({
          type: 'save',
          payload:  response.data
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        if (callback) callback();
      }

    },
    *exportCSV({ payload, callback }, { call, put }) {
      const response = yield call(exportCSV, payload);
      console.log(response)
      if(response.status===200){
        if (callback) callback(response.data.data.download_key);
      }
    },
    *reset({ payload }, { call, put }) {
      console.log('reset')
      yield put({
        type: 'save',
        payload: {data:[], meta: {pagination: {total: 0, per_page: 0}}}
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
        meta:action.payload.meta
      };
    },
    saveAndPush(state, action) {
      // console.log('[...state.data,...action.payload.data]',[...state.data,...action.payload.data]);
      const data=[...state.data,...action.payload.data];
      // data.map((item,index)=>{
      //   item.index=index
      // })
      return {
        ...state,
        data: data,
        meta:action.payload.meta
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
