import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/collectors/${resetParams.device_id}/information`,{
    method:'GET',
  });
}

