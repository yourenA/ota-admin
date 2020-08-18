import request from '@/utils/request';


export async function query({id,...resetParams}) {
  return request(`/devices/${id}/events`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

