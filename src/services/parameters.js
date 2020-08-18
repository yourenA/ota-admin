import request from '@/utils/request';


export async function query({collector_id,...resetParams}) {
  return request(`/collectors/${collector_id}/parameters`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}
export async function add({collector_id,...resetParams}) {
  return request(`/collectors/${collector_id}/parameters`, {
    method: 'POST',
    data: {
      ...resetParams,
    },
  });
}

export async function remove({collector_id,parameter_id,...resetParams}) {
  return request(`/collectors/${collector_id}/parameters/${parameter_id}`,{
    method: 'DELETE',
  });
}


