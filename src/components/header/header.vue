<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" width="64" height="64"/>
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <class-map :index="seller.supports[0].type" :num="1"></class-map>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="detailShow = true">
        <span class="count">{{seller.supports !== undefined && seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="detailShow = true">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <!--模糊背景-->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%"/>
    </div>
    <!--弹出的详情页,transition:定义弹出关闭样式-->
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <!--clearfix:定义清除浮动的样式-->
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <line-text msg="优惠信息"></line-text>
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="(item,index) in seller.supports" :key="index">
                <class-map :index="item.type" :num="2"></class-map>
                <span class="text">{{item.description}}</span>
              </li>
            </ul>
            <line-text msg="商家公告"></line-text>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="detailShow = false">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '@/components/star/star.vue';
  import lineText from '@/components/lineText/lineText.vue';
  import classMap from '@/components/classMap/classMap.vue';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {detailShow: false};
    },
    components: {
      star, lineText, classMap
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin";
  .header
    position: relative
    /*当阴影内容溢出元素框时隐藏*/
    overflow: hidden
    background: rgba(7, 17, 27, 0.5)
    color: #fff
    .content-wrapper
      position: relative
      padding: 24px 12px 18px 24px
      font-size: 0 //去除文字左边的空白字符
      .avatar
        display: inline-block
        vertical-align: top //顶部对齐
        img
          //图片圆角
          border-radius: 2px
      .content
        display: inline-block
        margin-left: 16px
        .title
          margin: 2px 0 8px 0
          .brand
            display: inline-block
            vertical-align: top
            width: 30px
            height: 18px
            // 获取设备像素比对应的图片路径
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
          .name
            margin-left: 6px
            font-size: 16px
            line-height: 20px
            font-weight: bold
        .description
          margin-bottom: 10px
          line-height: 12px
          font-size: 12px
        .support
          .text
            line-height: 14px
            font-size: 10px
      .support-count
        position: absolute
        right: 12px
        bottom: 14px
        padding: 0 8px
        height: 24px
        line-height: 24px
        border-radius: 14px
        background: rgba(0, 0, 0, 0.2)
        text-align: center
        .count
          line-height: 26px
          vertical-align: top
          font-size: 10px
        /*font-weight: 200*/
        .icon-keyboard_arrow_right
          margin-left: 2px
          line-height: 26px
          font-size: 10px
    .bulletin-wrapper
      position: relative
      height: 28px
      line-height: 28px
      padding: 0 22px 0 12px
      /*不换行*/
      white-space: nowrap
      /*超出部分隐藏*/
      overflow: hidden
      /*超出部分使用省略号*/
      text-overflow: ellipsis
      background: rgba(7, 17, 27, 0.2)
      .bulletin-title
        display: inline-block
        vertical-align: top
        margin-top: 8px
        width: 22px
        height: 12px
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        margin: 0 4px
        font-size: 10px
      .icon-keyboard_arrow_right
        position: absolute
        font-size: 10px
        right: 12px
        top: 8px
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      /*设置模糊*/
      filter: blur(10px)
    .detail
      position: fixed
      /*z-index:设置z轴位置(垂直延伸到显示区的轴),正数表示离用户更近*/
      z-index: 100
      /*设置全屏*/
      top: 0
      left: 0
      width: 100%
      height: 100%
      /*内容超出时可滚动*/
      overflow: auto
      background: rgba(7, 17, 27, 0.8)
      // fade-xxx: 定义css过渡动画
      transition: all .5s;
      // 模糊效果
      backdrop-filter: blur(10px)
      &.fade-enter-to
        opacity: 1
      &.fade-enter, &.fade-leave-to
        opacity: 0
      // 实现sticky footers设计
      .detail-wrapper
        /*最小高度*/
        min-height: 100%
        width: 100%
        .detail-main
          margin-top: 64px
          padding-bottom: 64px
          .name
            font-size: 16px
            font-weight: 700
            line-height: 16px
            text-align: center
          .star-wrapper
            margin-top: 18px
            padding: 2px 0
            text-align: center
          .supports
            width 80%
            margin: 0 auto
            .support-item
              padding: 0 12px
              margin-bottom: 12px
              font-size: 0
              &:last-child
                margin-bottom: 0
              .text
                line-height: 16px
                font-size: 12px
          .bulletin
            width: 80%
            margin: 0 auto
            .content
              padding: 0 12px
              line-height: 24px
              font-size: 12px
              font-weight: 200
      .detail-close
        position: relative
        width: 32px
        height: 32px
        margin: -64px auto 0 auto // 实现sticky footers设计
        clear: both // 实现sticky footers设计
        font-size: 32px
</style>
