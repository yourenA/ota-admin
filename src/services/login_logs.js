import request from '@/utils/request';


export async function query({id,...resetParams}) {
  return request(`/collectors/${id}/login_logs`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}


