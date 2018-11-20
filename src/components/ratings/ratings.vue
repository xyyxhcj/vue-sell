<template>
  <div class="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <rating-select :selectType.sync="selectType" :onlyContent.sync="onlyContent"
                     :RATING_TYPE="RATING_TYPE" :ratings="ratings"></rating-select>
      <div class="rating-wrapper">
        <ul>
          <li v-for="(rating,index) in selectedRatings" class="rating-item border-1px" :key="index">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar"/>
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <i class="icon-thumb_up"></i>
                <span class="item" v-for="(item,index) in rating.recommend" :key="index">{{item | replaceOmit}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '@/components/star/star.vue';
  import split from '@/components/split/split';
  import ratingSelect from '@/components/ratingSelect/ratingSelect';
  import BScroll from 'better-scroll'; // 滚动条JS
  import {CONSTANT} from '@/common/js/constant';
  import {formatDate} from '@/common/js/date'; // 引入js方法 'import {formatDate,...}'

  export default {
    name: 'ratings',
    props: {
      seller: Object
    },
    components: {star, split, ratingSelect},
    data() {
      return {
        onlyContent: true,
        RATING_TYPE: CONSTANT.RATING_TYPE,
        selectType: CONSTANT.RATING_TYPE.ALL,
        ratings: [],
        ratingScroll: Object
      };
    },
    created() {
      this.$http.get(process.env.HOST + '/api/ratings').then(response => {
        let result = response.body;
        if (CONSTANT.RESULT_CODE.SUCCESS === result.errno) {
          this.$data.ratings = result.data;
          // 当dom渲染完毕时再执行
          this.$nextTick(() => {
            this._initScroll();
          });
        }
      });
    },
    methods: {
      _initScroll() {
        // 'click: true':开启移动端派发点击事件
        this.ratingScroll = new BScroll('.ratings', {click: true});
      }
    },
    computed: {
      selectedRatings() {
        if (this.ratings && this.ratings.length > 0) {
          if (CONSTANT.RATING_TYPE.ALL === this.selectType) {
            return this.ratings.filter(rating => {
              return (this.onlyContent && rating.text.replace(/(^s*)|(s*$)/g, '').length !== 0) || !this.onlyContent;
            });
          } else {
            return this.ratings.filter(rating => {
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
      },
      replaceOmit(str) {
        if (str.length > 5) {
          return str.substring(0, 5) + '...';
        }
        return str;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl";
  .ratings
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        // '@media'适配小屏幕
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(167, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            margin: 0 12px
            line-height: 18px
            vertical-align: top
          .score
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          line-height: 18px
          font-size: 0
          .title
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
          .delivery
            margin-left: 12px
            font-size: 12px
            color: rgb(167, 153, 159)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          /*width: 28px*/
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              vertical-align: top
              margin-right: 6px
            .delivery
              display: inline-block
              vertical-align: top
              line-height: 12px
              font-size: 10px
              font-weight: 200
              color: rgb(147, 153, 159)
          .text
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
            margin-bottom: 8px
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up
              display: inline-block
              margin: 0 8px 4px 0
              font-size: 12px
              color: rgb(0, 160, 220)
            .item
              display: inline-block
              margin: 0 8px 4px 0
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              font-size: 9px
              color: rgb(147, 153, 159)
              background: #fff
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 12px
            font-size: 10px
            font-weight: 200
            color: rgb(147, 153, 159)
</style>
