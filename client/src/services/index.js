import request from 'utils/request';
import config from 'utils/config';
import qs from 'qs';

export function getMenu(param) {
  return request(`${config.api.getCatalog}/nav/${param.id}`);
}

export function getArticles(param) {
  return request(`${config.api.publicArticles}?${qs.stringify(param)}`, {
    method: 'GET',
  });
}

export function getArticle(param) {
  return request(`${config.api.publicArticle}/${param}`, {
    method: 'GET',
  });
}

export function getCatalog(param) {
  return request(`${config.public.catalog}/${param}`, {
    method: 'GET',
  });
}

export function isLike(param) {
  return request(`${config.api.isLike}/${param}`, {
    method: 'GET',
  }, true);
}

export function setLike(param) {
  return request(`${config.api.setLike}/${param}`, {
    method: 'GET',
  }, true);
}
