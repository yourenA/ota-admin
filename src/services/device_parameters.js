import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/grouping_parameters`,{
    method:'GET',
    params:{
      types:['generator','water_meter']
    }
  });
}


export async function add({device_id,...payload}) {
  return request(`/devices/${device_id}/parameters`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function remove({device_id,parameter_id}) {
  return request(`/devices/${device_id}/parameters/${parameter_id}`, {
    method: 'DELETE',
  });
}

