import request from 'utils/request';
import config from 'utils/config';

export function login(param) {
  return request(config.api.userLogin, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(param),
  });
}
