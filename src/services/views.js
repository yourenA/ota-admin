import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.devices_id}/views`,{
    method:'GET',
  });
}

export async function remove({id,...restParams}) {
  return request(`/devices/${restParams.devices_id}/views/${id}`, {
    method: 'DELETE',
  });
}

export async function add(payload) {
  return request(`/devices/${payload.devices_id}/views`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/devices/${restParams.devices_id}/views/${id}`, {
    method: 'PATCH',
    data: {
      ...restParams,
    },
  });
}

