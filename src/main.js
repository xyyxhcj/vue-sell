// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// import VueRouter from 'vue-router';
import App from './App';
// 引入router/index.js中配置的路由
import router from './router';
// vueTouch左右滑动效果
import './common/stylus/index.styl';

Vue.config.productionTip = false;
// 使用左右滑动监听时需注册VueTouch(标签'v-touch')
var VueTouch = require('vue-touch');
Vue.use(VueTouch, {name: 'v-touch'});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
