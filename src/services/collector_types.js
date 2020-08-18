import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/collector_types`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}


