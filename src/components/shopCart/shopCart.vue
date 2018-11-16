<template>
  <div>
    <div class="shopCart">
      <div class="content" @click="total.count > 0 ? fold = !fold:''">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':total.count > 0}">
              <i class="icon-shopping_cart"></i>
            </div>
            <div class="num" v-show="total.count > 0">{{total.count}}</div>
          </div>
          <div class="price" :class="{'highlight':total.price > 0}">￥{{total.price}}</div>
          <div class="desc">另需配送费{{deliveryPrice}}元</div>
        </div>
        <!--'.stop.prevent'阻止点击事件传递-->
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="{'enough':total.price >= minPrice}">
            {{payDesc}}
          </div>
        </div>
      </div>
      <!--加入购物车的小球掉落动画-->
      <div class="ball-container">
        <transition-group name="drop" tag="div" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <!--购物车内容-->
      <transition name="fold">
        <div class="shopCart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content">
            <ul>
              <li class="food" v-for="(food,index) in selectFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price * food.count}}</span>
                </div>
                <div class="cartControl-wrapper">
                  <cart-control :food="food"></cart-control>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!--模糊背景-->
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="fold = true"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartControl from '@/components/cartControl/cartControl';
  import BScroll from 'better-scroll'; // 滚动条JS
  export default {
    name: 'shopCart',
    components: {cartControl},
    props: {
      selectFoods: {
        type: Array,
        default() {
          // return [{price: 10, count: 5}];
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    computed: {
      total() {
        let totalPrice = 0;
        let totalCount = 0;
        this.selectFoods.forEach(food => {
          totalPrice += food.price * food.count;
          totalCount += food.count;
        });
        return {price: totalPrice, count: totalCount};
      },
      payDesc() {
        if (this.total.price === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.total.price < this.minPrice) {
          return `还差￥${this.minPrice - this.total.price}元起送`;
        } else {
          return '去结算';
        }
      },
      listShow() {
        return !this.fold && this.total.count > 0;
      }
    },
    created() {
      this.$nextTick(() => {
        this._initScroll();
      });
    },
    data() {
      return {
        dropBalls: [],
        balls: [
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ], // 购物车小球数组
        fold: true, // 默认折叠
        cartScroll: Object
      };
    },
    methods: {
      // 在父组件中获取添加商品时生成的小球,放入购物车小球数组
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      // 通过钩子绑定动画
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            // 获取元素位置与左下方购物车的偏移量,左上角为(0,0)
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            // 获取显示的第一个inner元素(获取不到v-show为false的inner-hook;如果使用ref会获取到未显示的inner)
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter(el, done) {
        // 触发浏览器重绘
        /* eslint-disable no-unused-vars */
        // let rf = el.offsetHeight;
        // 重绘样式
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          // let inner = this.enterBalls.shift();
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
          // done(); 直接 done看不到过渡的动画效果,必须等待dom完全加载完成再done()
        });
      },
      afterEnter(el) {
        el.style.display = 'none';
        let ball = this.dropBalls.shift();
        ball.show = false;
        ball.el = null;
      },
      // 初始化滚动条
      _initScroll() {
        // 'click: true':开启移动端派发点击事件
        this.cartScroll = new BScroll('.list-content', {click: true});
      },
      empty() {
        this.selectFoods.forEach(food => {
          food.count = 0;
        });
        this.fold = true;
      },
      pay() {
        if (this.total.price >= this.minPrice) {
          window.alert(`支付${this.total.price}`);
        }
      }
    }
  }
  ;
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin";
  .shopCart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px 2px
          padding: 6px
          width: 56px
          height: 56px
          /*border-box；使用两个并排的边框*/
          box-sizing: border-box
          // 'border-radius: 50%':通过设置圆角,将方形div变成圆形
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
              .icon-shopping_cart
                color: #fff
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 12px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            // 'box-shadow':设置阴影
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          // 小球掉落动画
          // linear:线性
          transition: all 0.5s linear
        &.drop-enter-active
          // cubic-bezier:曲线
          transition: all 0.5s cubic-bezier(.49, -0.29, .75, .41)
    .shopCart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      // 购物车内容弹框缓动
      transition: all 0.5s
      transform: translate3d(0, -100%, 0);
      &.fold-enter, &.fold-leave-to
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartControl-wrapper
            position: absolute
            right: 0
            bottom: 6px

  // 购物车的模糊背景
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    background: rgba(7, 17, 27, 0.6)
    transition: all 0.4s
    .fade-enter-to
      opacity: 1
      backdrop-filter: blur(10px)
    .fade-enter, .fade-leave-to
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
