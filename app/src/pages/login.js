import Vue from 'vue';
import Vant from 'vant';

import 'vant/lib/index.css';
import 'lib-flexible/flexible';

import FastClick from 'fastclick';

import '@babel/polyfill';
import Login from './login.vue';
import router from './router';

Vue.config.productionTip = false;
FastClick.attach(document.body);
Vue.use(Vant)
new Vue({
  router,
  render: (h) => h(Login),
}).$mount('#login');
