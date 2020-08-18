import request from '@/utils/request';


export async function query({endpoint_id,...resetParams}) {
  return request(`/users`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

export async function remove({id}) {
  return request(`/users/${id}`, {
    method: 'DELETE',
  });
}

export async function resetPassword({id}) {
  console.log('id',id)
  return request(`/users/${id}/password`, {
    method: 'PUT',
  });
}
export async function add(payload) {
  return request(`/users`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/users/${id}`, {
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
