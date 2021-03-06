import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import oFedc from './fedc/index';
import './plugins/element.js';
import { Message } from 'element-ui';
import VueQuillEditor from 'vue-quill-editor';

// require styles
// import 'quill/dist/quill.core.css';
// import 'quill/dist/quill.snow.css';
// import 'quill/dist/quill.bubble.css';

Vue.config.productionTip = false;
Vue.use(oFedc);

Vue.use(VueQuillEditor /* { default global options } */);

router.beforeEach((to, from, next) => {
  let isLogin = localStorage.getItem('isLogin');
  if (isLogin === 'true') {
    store.state.isLogin = true;
    let oUser = <any>localStorage.getItem('oUser');
    store.state.oUser = JSON.parse(oUser);
    next();
    if (to.path === '/login') {
      // tslint-disable-next-line
      Message.warning('请先退出登录！');
      next({
        path: '/home'
      });
    }
  } else {
    // 用户想进入需要登录的页面，则定向回登录界面
    if (to.meta.isLogin) {
      next({
        path: '/login'
      });
      // iViewUi友好提示
      // tslint-disable-next-line
      // 用户进入无需登录的界面，则跳转继续
    } else {
      next();
    }
  }
});

router.afterEach(route => {
  window.scroll(0, 0);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
