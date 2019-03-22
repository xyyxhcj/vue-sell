import Vue from 'vue';
import Router from 'vue-router';
// VueResource:基于全局Vue对象使用http
import VueResource from 'vue-resource';
// @:配置在webpack.base.conf.js中的别名
import goods from '@/components/goods/goods';
import ratings from '@/components/ratings/ratings';
import seller from '@/components/seller/seller';

Vue.use(Router);
Vue.use(VueResource);
// 通过设置'/'路由跳转实现默认路由
// linkActiveClass:设置全局的选中class
export default new Router({
  linkActiveClass: 'active',
  routes: [
    {path: '/', redirect: goods},
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    }
  ]
});
