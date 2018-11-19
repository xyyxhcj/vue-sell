<template>
  <transition name="move">
    <div v-show="showFlag" class="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image"/>
          <div class="back" @click="showFlag = false">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating ? food.rating : 0}}%</span>
          </div>
          <div class="price">
            <span class="now"><span class="char">￥</span>{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartControl-wrapper" v-if="food.count > 0">
            <!--此处的'$event'为子组件传递过来的'$event.target'-->
            <cart-control :food="food" @cart-add="$emit('cart-add',$event)"></cart-control>
          </div>
          <div class="buy" v-else @click.stop.prevent="addCart($event,1)">加入购物车</div>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <rating-select :selectType.sync="selectType" :onlyContent.sync="onlyContent" :desc="desc"
                         :ratings="food.ratings" :RATING_TYPE="RATING_TYPE"></rating-select>
          <div class="rating-wrapper">
            <ul v-if="selectedRatings && selectedRatings.length">
              <li v-for="(rating,index) in selectedRatings" class="rating-item" :key="index">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar"/>
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <i class="icon-thumb_up" v-if="RATING_TYPE.POSITIVE === rating.rateType"></i>
                  <i class="icon-thumb_down" v-else></i>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-else>暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll'; // 滚动条JS
  import cartControl from '@/components/cartControl/cartControl';
  import split from '@/components/split/split';
  import ratingSelect from '@/components/ratingSelect/ratingSelect';
  import {formatDate} from '@/common/js/date'; // 引入js方法 'import {formatDate,...}'
  import {CONSTANT} from '@/common/js/constant';

  export default {
    name: 'food',
    components: {cartControl, split, ratingSelect},
    props: {food: Object},
    data() {
      return {
        showFlag: false,
        foodScroll: Object,
        onlyContent: true,
        desc: {all: '全部', positive: '推荐', negative: '吐槽'},
        RATING_TYPE: CONSTANT.RATING_TYPE,
        selectType: CONSTANT.RATING_TYPE.ALL
      };
    },
    methods: {
      _initScroll() {
        this.$nextTick(() => {
          if (this.foodScroll && this.foodScroll instanceof BScroll) {
            this.foodScroll.refresh();
          } else {
            this.foodScroll = new BScroll('.food', {click: true});
          }
        });
      },
      show() {
        this.showFlag = true;
        this._initScroll();
      },
      addCart(event, num) {
        if (event._constructed) {
          // 使用'Vue.set'创建属性,该属性才会被Vue侦听
          Vue.set(this.food, 'count', 1);
          // 将事件派发给购物车小球(Vue2将dispatch改为$emit)
          this.$emit('cart-add', event.target);
        }
      }
    },
    computed: {
      selectedRatings() {
        if (this.food.ratings) {
          if (CONSTANT.RATING_TYPE.ALL === this.selectType) {
            return this.food.ratings.filter(rating => {
              return (this.onlyContent && rating.text.replace(/(^s*)|(s*$)/g, '').length !== 0) || !this.onlyContent;
            });
          } else {
            return this.food.ratings.filter(rating => {
              return rating.rateType === this.selectType && ((this.onlyContent && rating.text.replace(/(^s*)|(s*$)/g, '').length !== 0) || !this.onlyContent);
            });
          }
        } else {
          return [];
        }
      }
    },
    filters: {
      // 格式化时间戳
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    created() {
      this._initScroll();
    },
    // 'keepAlive: false':使该组件不缓存
    meta: {
      keepAlive: false
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl";
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    // 从右到左的飞入动画
    &.move-enter-to
      transform: translate3d(0, 0, 0)
      transition: all 0.4s ease-in
    &.move-enter, &.move-leave-to
      transform: translate3d(100%, 0, 0)
      transition: all 0.4s ease-in
    .image-header
      position: relative
      width: 100%
      height: 0
      // 'padding-top:100%':使盒子宽高相等
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700px
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 10px
          color: rgb(147, 153, 159);
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
          .char
            font-size: 10px
        .old
          vertical-align: top
          // 文字的中划线
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
      .cartControl-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        color: #fff
        background: rgb(0, 160, 220)

    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147, 153, 159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
            font-weight: 700
            i
              margin-right: 4px
              line-height: 16px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147, 153, 159)
</style>
