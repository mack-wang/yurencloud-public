import config from 'utils/config';
import request from 'utils/request';
import qs from 'qs';

export function catalog() {
  return request(config.api.getCatalog);
}

export function catalogPage(param) {
  return request(`${config.api.getCatalog}/page?${qs.stringify(param)}`);
}


export function catalogCascader(catalogId) {
  return request(`${config.api.catalogCascader}/${catalogId}`, {
    method: 'GET',
  });
}

export function modifyCatalog(param) {
  return request(config.api.catalog, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify(param),
  }, true);
}

export function deletes(param) {
  return request(`${config.api.catalog}/${param.id}`, {
    method: 'DELETE',
  }, true);
}

export function off(param) {
  return request(`${config.api.catalog}/off/${param.id}`, {
    method: 'PATCH',
  }, true);
}

export function createCatalog(param) {
  return request(`${config.api.catalog}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    body: qs.stringify(param),
  }, true);
}

export function catalogMenu() {
  return request(`${config.api.getCatalog}/menu`);
}
