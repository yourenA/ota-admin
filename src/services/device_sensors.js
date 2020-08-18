import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/grouping_parameters`,{
    method:'GET',
    params:{
      types:['sensor']
    }
  });
}


export async function add({device_id,...payload}) {
  return request(`/devices/${device_id}/sensors`, {
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
export async function edit({device_id,parameter_id,...resetParams}) {
  return request(`/devices/${device_id}/sensors/${parameter_id}`, {
    method: 'PUT',
    data:resetParams
  });
}

