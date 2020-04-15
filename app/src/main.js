import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import Vant from 'vant';

import 'vant/lib/index.css';
import 'lib-flexible/flexible';

import FastClick from 'fastclick';

import '@babel/polyfill';

Vue.config.productionTip = false;
FastClick.attach(document.body);
Vue.use(Vant)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

