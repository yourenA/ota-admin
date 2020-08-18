import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/real_time_error_data`,{
    method:'GET',
  });
}


