import request from '@/utils/request';


export async function query() {
  return request(`/system_configs`,{
    method:'GET',
  });
}


export async function edit({...restParams}) {
  return request(`/system_configs`, {
    method: 'PATCH',
    data: {
      ...restParams,
    },
  });
}
