import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/products`,{
    method:'GET',
    params:{
      ...resetParams,
      order_direction:'desc'
    }
  });
}

export async function remove({id}) {
  return request(`/products/${id}`, {
    method: 'DELETE',
  });
}

export async function resetPassword({id}) {
  console.log('id',id)
  return request(`/products/${id}/password`, {
    method: 'PUT',
  });
}
export async function add(payload) {
  return request(`/products`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/products/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}

