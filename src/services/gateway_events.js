import request from '@/utils/request';


export async function query({id,...resetParams}) {
  return request(`/products/${id}/devices`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

