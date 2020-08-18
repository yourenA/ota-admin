import request from '@/utils/request';


export async function query({...resetParams}) {
  return request(`/devices/${resetParams.device_id}/valves`,{
    method:'GET',
  });
}


export async function edit({device_id,valve_id,...payload}) {
  return request(`/devices/${device_id}/double_ball_valves/${valve_id}/status`, {
    method: 'POST',
    data: {
      ...payload,
    },
  });
}

