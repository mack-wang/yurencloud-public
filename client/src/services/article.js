/* eslint-disable linebreak-style */
import config from 'utils/config';
import request from 'utils/request';
import qs from 'qs';

export function upload(file, token) {
  return new Promise(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', config.api.uploadArticleImage);
      xhr.setRequestHeader('Authorization', `Bearer${token}`);
      const data = new FormData();
      data.append('image', file);
      xhr.send(data);
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
}

export function create(param) {
  return request(config.api.createArticle, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(param),
  }, true);
}

export function getAll(param) {
  return request(`${config.api.articles}?${qs.stringify(param)}`, {
    method: 'GET',
  }, true);
}

export function setView(param) {
  return request(`${config.public.articleView}/${param}`, {
    method: 'GET',
  });
}

// 获取指定id文章是不用授权的
export function getOne(param) {
  return request(`${config.api.article}/${param.id}`, {
    method: 'GET',
  });
}

export function modify(param) {
  return request(config.api.article, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify(param),
  }, true);
}

export function deletes(param) {
  return request(`${config.api.article}/${param.id}`, {
    method: 'DELETE',
  }, true);
}

export function recommend(param) {
  return request(`${config.api.article}/recommend/${param.id}`, {
    method: 'PATCH',
  }, true);
}

export function top(param) {
  return request(`${config.api.article}/top/${param.id}`, {
    method: 'PATCH',
  }, true);
}

