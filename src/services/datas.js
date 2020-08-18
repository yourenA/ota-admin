import request from '@/utils/request';


export async function query({id,...resetParams}) {
  return request(`/devices/${id}/data`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

