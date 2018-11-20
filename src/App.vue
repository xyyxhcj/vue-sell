<template>
  <div id="app">
    <v-header :seller="seller" v-show="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <!--router-link:配置路由,默认会被渲染成一个<a>标签,to属性指定链接-->
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!--router-view:路由出口,渲染路由匹配到的组件; 'keep-alive':切换组件时保留数据-->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  // 注册header组件
  import header from './components/header/header';
  import {CONSTANT} from '@/common/js/constant';
  import {urlParse} from '@/common/js/utils';

  export default {
    data() {
      return {
        seller: {
          id: (() => {
            // 从请求url中提取id参数
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    created() {
      this.$http.get(process.env.HOST + '/api/seller?id=' + this.seller.id).then(response => {
        let result = response.body;
        if (CONSTANT.RESULT_CODE.SUCCESS === result.errno) {
          // 'Object.assign':为对象扩展属性(不删除原属性)
          this.seller = Object.assign({}, this.seller, result.data);
        }
      }, response => {
      });
    },
    components: {
      'v-header': header
    }
  };
  // 获取手机的像素密度
  // alert(window.devicePixelRatio);
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "./common/stylus/mixin.styl"
  #app
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height 40px
      // border-bottom: solid 1px rgba(7, 17, 27, 0.1)
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align: center
        /*&:表示上一级选择器; 等同于 'a'*/
        & > a
          display: block /*使a元素撑满整个div->点击整个div都可实现点击效果*/
          font-size: 28px
          color: rgb(77, 85, 93)
          &.active
            color: rgb(240, 20, 20)
</style>
