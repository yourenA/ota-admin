import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/substrates`,{
    method:'GET',
    params:{
      ...resetParams,
      order_direction:'desc'
    }
  });
}

export async function remove({id}) {
  return request(`/substrates/${id}`, {
    method: 'DELETE',
  });
}

export async function resetPassword({id}) {
  console.log('id',id)
  return request(`/substrates/${id}/password`, {
    method: 'PUT',
  });
}
export async function add(payload) {
  return request(`/substrates`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}
export async function mulAdd(payload) {
  return request(`/substrates/bulk`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}
export async function edit({id,...restParams}) {
  return request(`/substrates/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}

