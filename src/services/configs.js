import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/collectors/${resetParams.device_id}/configs`,{
    method:'GET',
  });
}


export async function edit(restParams) {
  return request(`/collectors/${restParams.device_id}/configs`, {
    method: 'PATCH',
    data: {
      ...restParams,
    },
  });
}

