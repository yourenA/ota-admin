import { query,add,remove,edit ,editStatus,resetPassword } from '@/services/whole_data';

export default {
  namespace: 'whole_data',
  state: {
    data:[],
    meta: {totalElements: 0, size: 0,number:0},
    loading: true,
    pageLoaded:false

  },
  effects: {
    *loadedPage({payload}, { call, put }) {
      yield put({
        type: 'changePageLoaded',
        payload: payload,
      });
    },
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
          payload:  response.data,
        });
        yield put({
          type: 'changeLoading',
          payload: false,
        });
        if (callback) callback();
      }

    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);

      console.log(response)
      if(response.status===200){
        if (callback) callback();
      }else{
      }
    },
    *edit({ payload, callback }, { call, put }) {
      console.log('edit')
      const response = yield call(edit, payload);
      console.log(response)
      if(response.status===200){
        if (callback) callback();
      }
    },
    *editStatus({ payload, callback }, { call, put }) {
      const response = yield call(editStatus, payload);
      console.log(response)
      if(response.status===200){
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(remove, payload);
      if(response.status===200){
        if (callback) callback();
      }
    },
    *resetPassword({ payload, callback }, { call, put }) {
      const response = yield call(resetPassword, payload);
      if(response.status===200){
        if (callback) callback();
      }
    },
  },

  reducers: {
    changePageLoaded(state, action){
      return {
        ...state,
        pageLoaded: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload._embedded.firmwareUpgradeStatuses,
        meta:action.payload.page,
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
