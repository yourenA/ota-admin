import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/grouping_parameters`,{
    method:'GET',
    params:{
      types:['error']
    }
  });
}


export async function add({device_id,...payload}) {
  console.log('payload',payload)
  return request(`/devices/${device_id}/errors`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}
export async function edit({device_id,parameter_id,...payload}) {
  console.log('payload',payload)
  return request(`/devices/${device_id}/errors/${parameter_id}`, {
    method: 'PUT',
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
