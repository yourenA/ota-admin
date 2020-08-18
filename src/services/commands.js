import request from '@/utils/request';


export async function query({id,...resetParams}) {
  return request(`/devices/${id}/commands`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

export async function add({id,...payload}) {
  return request(`/devices/${id}/commands`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

