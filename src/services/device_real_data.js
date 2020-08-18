import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/real_time_data`,{
    method:'GET',
    params:{
      view_ids:resetParams.view_ids
    }
  });
}

