<template>
  <div class="cartControl">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="addCart($event,-1)">
        <i class="inner icon-remove_circle_outline"></i>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add" @click.stop.prevent="addCart($event,1)">
      <i class="inner icon-add_circle"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    name: 'cartControl',
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event, num) {
        if (event._constructed) {
          if (!this.food.count) {
            // 使用'Vue.set'创建属性,该属性才会被Vue侦听
            Vue.set(this.food, 'count', 1);
          } else {
            this.food.count += num;
          }
          if (num > 0) {
            // 将事件派发给购物车小球(Vue2将dispatch改为$emit)
            this.$emit('cart-add', event.target);
          }
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .cartControl
    font-size: 0
    .cart-decrease, .cart-add
      display: inline-block
      // 扩大图标的点击区域
      padding: 6px
      .inner
        // 'display: inline-block':使布局元素可设置宽高
        display: inline-block
        font-size: 24px
        line-height: 24px
        color: rgb(0, 160, 220)
        transition: all 0.4s linear
      // 添加动画
      transition: all 0.4s linear
      &.move-enter-to
        opacity: 1
        transform: translate3d(0, 0, 0)
        .inner
          transform: rotate(0)
      &.move-enter, &.move-leave-to
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          // rotate(180deg):2D旋转180度
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
</style>
