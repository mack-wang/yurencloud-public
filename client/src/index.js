import dva from 'dva';
import createLoading from 'dva-loading';
import { browserHistory } from 'dva/router';
import './index.css';

// 1. Initialize
const app = dva({
  history: browserHistory,
  ...createLoading({
    effects: true,
  }),
});


app.model(require('./models/login'));


app.model(require('./models/index'));


app.model(require('./models/query'));


app.model(require('./models/catalog'));


app.model(require('./models/article'));


app.model(require('./models/adminSider'));


app.model(require('./models/edit'));


app.model(require('./models/auth'));


app.model(require('./models/register'));


app.model(require('./models/home'));


// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
