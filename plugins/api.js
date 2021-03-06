/*eslint no-unused-vars: 0 */
import {
  makeGet,
  makePost,
  setup,
  makeResource,
  decorateMaker,
  makePut,
  makePatch,
  makeDelete
} from '@/api';
import {
  isFunc
} from '~/utils';
import {
  Message
} from 'element-ui';

import router from '@/router';
import axios from 'axios';

const CancelToken = axios.CancelToken;
let source = CancelToken.source();

let baseURL = '/api/v1.0';

switch (process.env.NODE_ENV) {
case 'development':
  baseURL = '/api/v1.0';
  break;
case 'qa':
  baseURL = 'https://stage.exgcc.com/api/v1.0';
  break;
case 'production':
  baseURL = 'https://api.51dianxiaoge.com/v1.0';
  break;
default:
  '/api/v1.0';
  break;
}

setup({
  baseURL,
  cancelToken: source.token,
  headers: {
    'content-type': 'application/json'
  },
  interceptors: {
    reponse(res) {
      const {
        code,
        message,
        data
      } = res;
      if (code && code !== 0) {
        Message({
          message: message,
          type: 'error'
        });

        return Promise.reject(message);
      }

      return data;
    }
  }
});

const interceptor = function ({
  response,
  message
}) {
  const {
    status,
    data
  } = response || {};

  if (status === 401) {
    // source.cancel('login required.');

    // source = CancelToken.source();
    // setup({
    // 	cancelToken: source.token
    // });

    localStorage.user = '{}';
    router.push('/login');
    return data;
  }
  return Promise.reject(data);
};
const [get, post, put, del, patch] = [
  makeGet,
  makePost,
  makePut,
  makeDelete,
  makePatch
].map(action => decorateMaker(action, interceptor));

const resource = (url, actions) => {
  return makeResource(url, actions, {
    GET: get,
    POST: post,
    PUT: put,
    DELETE: del,
    PATCH: patch
  });
};

const apis = {
  houses: resource('/projects/{projectId}/houses'),
  communities: resource('/projects/{projectId}/communities'),
  contracts: resource('/projects/{projectId}/contracts'),
  rooms: resource('/projects/{projectId}/rooms'),
  locations: get('/locations'),
  districts: get('/districts'),
  environments: get('/environments'),
  contract_bill: resource('/projects/{projectId}/contracts/{id}/bills'),
  set_electric_price: resource(
    '/projects/{projectId}/houses/{houseId}/prices'
  ),
  login: post('login'),
  devices: resource('/projects/{projectId}/devices'),
  delDevices: resource('/projects/{projectId}'),
  room_devices: resource(
    '/projects/{projectId}/houses/{houseId}/rooms/{roomId}/devices'
  ),
  house_devices: resource('/projects/{projectId}/houses/{houseId}/devices'),
  credentials: resource('/projects/{projectId}/credentials'),
  paid_bills: resource(
    '/projects/{projectId}/contracts/{contractId}/prePaidBills'
  ),
  room_detail: resource(
    '/projects/{projectId}/houses/{houseId}/rooms/{roomId}'
  ),
  housedetail: resource('/projects/{projectId}/houses/{id}'),
  // 添加资金渠道
  fund_channel: resource('/projects/{projectId}/fundChannels'),
  pay_channel: resource('/projects/{projectId}/payChannels'),
  top_up: resource('/projects/{projectId}/users/{userId}'),
  all_user_bills: resource('/projects/{projectId}/bills'),
  config_list: resource('/projects/{projectId}/config'),
  room_contracts: resource('/projects/{projectId}/rooms/{roomId}/contracts'),
  delete_room: resource('/projects/{projectId}/houses/{houseId}/rooms'),
  add_room: resource('/projects/{projectId}/houses/{houseId}/rooms'),
  contracts_info: resource('/projects/{projectId}/contracts/{contractId}'),
  bill_collection: resource('/projects/{projectId}/bills/{billId}/payments'),
  flow_month: resource('/projects/{projectId}/flows'),
  house_info: resource('/projects/{projectId}/houses/{houseId}'),
  electricity_instructions: resource('/projects/{projectId}/instructions'),
  volume_set: resource('/projects/{projectId}/prices'),
  administrator_change: resource('/projects/{projectId}/credentials'),
  apportionment: resource('/projects/{projectId}/houses/{id}/apportionment'),
  reading_equipment: resource('/projects/{projectId}/devices/reading'),
  logout: resource('/logout'),
  user_info: resource('/projects/{projectId}/users/{userInfoId}'),
  scale_read: resource('/projects/{projectId}/devices/{deviceId}/scale'),
  change_remark: resource('/projects/{projectId}/devices'),
  project_balance: resource('/projects/{projectId}/balance'),
  blance_withdraw: resource('/projects/{projectId}/withdraw'),
  electric_withdraw: resource('/projects/{projectId}/withdraw/{id}'),
  device_usage: resource('/projects/{projectId}/devices/{deviceId}/usage'),
  manual_notifications: resource('/projects/{projectId}/manualNotifications'),
  userInfoChange: resource('/projects/{projectId}/users'),
  apportionment_put: resource('/projects/{projectId}/houses/{houseId}')
};

/**
 * 通过接口名称返回请求对象
 * @param {string} entry	接口名称
 * @param {object} data  query/body 参数
 * @param {object} params url 参数
 */
export default function (entry, data, params) {
  // entry - string, array, function

  if (apis.hasOwnProperty(entry)) {
    return isFunc(apis[entry]) ? apis[entry](data, params) : apis[entry];
  }

  throw 'Entry not defined';
}
