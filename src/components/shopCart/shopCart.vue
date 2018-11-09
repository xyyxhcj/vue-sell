<template>
  <div class="shopCart">
    <div class="content">
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
      <div class="content-right">
        <div class="pay" :class="{'enough':total.price >= minPrice}">
          {{payDesc}}
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'shopCart',
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
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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
</style>
