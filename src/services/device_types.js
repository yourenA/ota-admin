import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/device_types`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}
export async function add(payload) {
  return request(`/device_types`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}
export async function edit({id,...restParams}) {
  return request(`/device_types/${restParams.device_types_id}`, {
    method: 'PATCH',
    data: {
      ...restParams,
    },
  });
}


