import request from 'utils/request';
import config from 'utils/config';

function checkUsername(param) {
  return request(config.api.checkUsername, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body: `username=${param}`,
  });
}

function register(param) {
  return request(config.api.userRegister, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(param),
  });
}

export { checkUsername, register };
