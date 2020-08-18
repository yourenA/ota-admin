import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/collectors`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}
export async function add(payload) {
  return request(`/collectors`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}
export async function edit({id,...restParams}) {
  return request(`/collectors/${id}`, {
    method: 'PATCH',
    data: {
      ...restParams,
    },
  });
}

export async function remove({id}) {
  return request(`/collectors/${id}`, {
    method: 'DELETE',
  });
}


