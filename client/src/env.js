const DEV = {
  API_URL: 'http://www.yurencloud.com:8080',
};

const PRO = {
  API_URL: 'http://www.yurencloud.com:8080',
};

let ENV = {};

// 如果是开发环境，则ENV为DEV，否则ENV是PRO
if ('development'.indexOf(process.env.NODE_ENV) > -1) {
  ENV = DEV;
} else {
  ENV = PRO;
}

export default ENV;
