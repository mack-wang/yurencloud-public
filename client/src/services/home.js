import request from 'utils/request';
import config from 'utils/config';

export function profile() {
  return request(config.api.userProfile, {
    method: 'GET',
  }, true);
}
