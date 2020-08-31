import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/substrate_upgrade_logs`,{
    method:'GET',
    params:{
      ...resetParams,
      order_direction:'desc'
    }
  });
}

export async function remove({id}) {
  return request(`/gateways/${id}`, {
    method: 'DELETE',
  });
}

export async function resetPassword({id}) {
  console.log('id',id)
  return request(`/gateways/${id}/password`, {
    method: 'PUT',
  });
}
export async function add(payload) {
  return request(`/gateways`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

export async function edit({id,...restParams}) {
  return request(`/gateways/${id}`, {
    method: 'PUT',
    data: {
      ...restParams,
    },
  });
}

