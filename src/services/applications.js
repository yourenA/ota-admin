import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/firmwares`,{
    method:'GET',
    params:{
      ...resetParams,
      order_direction:'desc'
    }
  });
}

export async function remove({id}) {
  return request(`/firmwares/${id}`, {
    method: 'DELETE',
  });
}

export async function resetPassword({id}) {
  console.log('id',id)
  return request(`/firmwares/${id}/password`, {
    method: 'PUT',
  });
}
export async function add(payload) {
  return request(`/firmwares`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}
export async function bulk_add(payload) {
  return request(`/firmwares/bulk`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/firmwares/${id}`, {
    method: 'PUT',
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
