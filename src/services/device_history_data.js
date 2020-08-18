import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/historical_data`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

export async function exportCSV(resetParams) {
  return request(`/devices/${resetParams.device_id}/historical_data_files`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}
