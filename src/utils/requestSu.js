import axios from 'axios'

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
  return axios(`http://test.zhsgy.top:7409/firmwareUpgradeStatuses${url}`, newOptions)
    .then(response => {
      console.log('response',response)
      return response
    })
    .catch((error) => {
      // converErrorCodeToMsg(error)
      return error;
    });
}
