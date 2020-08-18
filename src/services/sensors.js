import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/sensors`,{
    method:'GET',
  });
}

export async function remove({id,...restParams}) {
  return request(`/devices/${restParams.device_id}/sensors/${id}`, {
    method: 'DELETE',
  });
}

export async function add(payload) {
  return request(`/devices/${payload.device_id}/sensors`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/devices/${restParams.device_id}/sensors/${id}`, {
    method: 'PATCH',
    data: {
      ...restParams,
    },
  });
}

export async function editStatus({data:{id,status}}) {
  return request(`/users/${id}/status`, {
    method: 'PUT',
    data: {
      status,
    },
  });
}
