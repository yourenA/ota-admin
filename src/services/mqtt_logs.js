import request from '@/utils/request';


export async function query({id,...resetParams}) {
  return request(`/collectors/${id}/mqtt_logs`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}


