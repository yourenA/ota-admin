import axios from 'axios'
import { converErrorCodeToMsg } from './utils';
import config from '@/config/config'
import { getLocale } from 'umi/locale';

function checkStatus(response) {
  console.log(response)
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    // credentials: 'include',

  };
  const newOptions = { ...defaultOptions, ...options };
  let language=getLocale()==='zh-CN'?'zh-CN':'en'
  if (url!=='/login') {
    newOptions.headers = {Authorization: `Bearer ${sessionStorage.getItem('token')}`,language}
  }else{
    newOptions.headers = {language}
  }
  console.log('newOptions',newOptions)
  return axios(`${config.prefix}${url}`, newOptions)
    .then(response => {
      console.log('response',response)
      return response
    })
    .catch((error) => {
      converErrorCodeToMsg(error)
      return error;
    });
}
