import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/view_templates`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

export async function remove({id}) {
  return request(`/view_templates/${id}`, {
    method: 'DELETE',
  });
}

export async function resetPassword({id}) {
  console.log('id',id)
  return request(`/view_templates/${id}/password`, {
    method: 'PUT',
  });
}
export async function add(payload) {
  return request(`/view_templates`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/view_templates/${id}`, {
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
