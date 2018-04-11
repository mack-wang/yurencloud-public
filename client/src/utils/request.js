import fetch from 'dva/fetch';
import { message } from 'antd';


function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);// 在控制台打印错误
  error.response = response;// 给错误增加一个属性 response
  throw error;
}

const errorMessage = {
  400: '请求错误',
  401: '未授权，请重新登入',
  403: '已授权，但访问是被禁止的',
  404: '您访问的页面不存在',
  406: '您请求的格式不正确',
  410: '您请示的资源已经被永久的删除',
  422: '创建对象时，发生验证错误',
  500: '服务器发生错误',
  600: '网络错误',
};

/**
 * Requests a URL, returning a promise.
 * 给一个URL 返回一个promise
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] [token] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options, auth) {
  if (auth) {
    const token = JSON.parse(localStorage.getItem('token')).token;
    // 存在header就跳过，不存在，就赋值
    if (!options.headers) {
      options.headers = {};
    }
    options.headers.Authorization = `Bearer${token}`;
  }
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then((response) => { // 只剩下获取的数据
      // 无需返回http的状态码，因为服务器会自动返回
      // //操作的成功和失败，比如删除，创建，搜索，获取; 同时也表示 有，或者无
      // private Boolean result;
      // //文字提示内容，删除成功，下载成功
      // private String message;
      // //携带的对象信息，获取的信息对象，列表数据等
      // private Object data;

      const { result, content, data } = response;
      return {
        success: true,
        content, // string
        result, // bool
        data, // object 有data就展开，没data就不赋值
      };
    })
    .catch((error) => {
      // XMLHttpRequest 对象的 status 和 statusText 属性保存有服务器返回的 http 状态码
      const { response } = error; // 接收错误的属性
      let content;
      let status;
      if (response && response instanceof Object) { // 如果响应存在，同时响应是一个对象
        status = response.status;
        content = errorMessage[status] || response.statusText;
      } else {
        status = 600;
        content = error.message || '网络错误！';
      }
      // 如果抛出错误，但未得到catch,则会由全局的onError接收
      message.error(content);
      // 如果直接return Promise.reject()的话，会直接抛出浏览器给的错误，比如unauth 一类的，无法返回我们要的对象
      // 所以按默认的，直接返回对象
      return { success: false, status, content };
    });
}
