import request from 'utils/request';

// 从服务器获取数据
export function query() {
  return request('/api/users');
}
