import request from '@/utils/requestSu';


export async function query({id,...resetParams}) {
  return request(`/search/findByRtuId`,{
    method:'GET',
    params:{
      ...resetParams
    }
  });
}

