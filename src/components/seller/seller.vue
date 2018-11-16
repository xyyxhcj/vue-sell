<template>
  <div class="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2 class="title">起送价</h2>
            <div class="content"><span class="stress">{{seller.minPrice}}</span>元</div>
          </li>
          <li class="block">
            <h2 class="title">商家配送</h2>
            <div class="content"><span class="stress">{{seller.deliveryPrice}}</span>元</div>
          </li>
          <li class="block">
            <h2 class="title">平均配送时间</h2>
            <div class="content"><span class="stress">{{seller.deliveryTime}}</span>分钟</div>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports border-1px">
          <li class="support-item" v-for="(item,index) in seller.supports" :key="index">
            <class-map :index="item.type" :num="4"></class-map>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper">
          <ul class="pic-list" ref="pic-list">
            <li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
              <img width="120" height="90" :src="pic"/>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '@/components/star/star.vue';
  import split from '@/components/split/split.vue';
  import classMap from '@/components/classMap/classMap.vue';
  import BScroll from 'better-scroll'; // 滚动条JS

  export default {
    name: 'seller',
    props: {
      seller: Object
    },
    components: {star, split, classMap},
    data() {
      return {
        sellerScroll: Object,
        picScroll: null
      };
    },
    // 当dom渲染完毕后加载滚动控件
    mounted() {
      this.sellerScroll = new BScroll('.seller', {click: true});
      this._initPicScroll();
    },
    watch: {
      // 当数据变化时重新渲染滚动控件
      seller() {
        this.sellerScroll.refresh();
        this._initPicScroll();
      }
    },
    methods: {
      _initPicScroll() {
        if (this.seller && this.seller.pics) {
          // BScroll水平滚动时需要计算div的宽度
          let picWidth = 120;
          let margin = 6;
          this.$refs['pic-list'].style.width = (picWidth + margin) * this.seller.pics.length + 'px';
        }
        if (this.picScroll) {
          this.picScroll.refresh();
        } else {
          // 'scrollX: true':横向滚动; 'eventPassthrough: 'vertical'':横向滚动时不触发垂直滚动
          this.picScroll = new BScroll('.pic-wrapper', {scrollX: true, eventPassthrough: 'vertical'});
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .desc
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 0
        .star
          display: inline-block
          vertical-align: top
        .text
          display: inline-block
          margin: 0 4px 0 8px
          line-height: 18px
          font-size: 10px
          color: rgb(77, 85, 93)
      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          text-align: center
          border-right: solid 1px rgba(7, 17, 27, 0.1)
          &:last-child
            border-right: none
          .title
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .content
            line-height: 24px
            font-size: 10px
            font-weight: 200
            color: rgb(7, 17, 27)
            .stress
              font-size: 24px
    .bulletin
      padding: 18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .content-wrapper
        padding: 0 12px 16px
        border-1px(rgba(7, 17, 27, 0.1))
        .content
          line-height: 24px
          font-size: 12px
          font-weight: 200
          color: rgb(240, 20, 20)
      .supports
        .support-item
          padding: 16px 12px
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 0
          // 不显示最后一个元素的下划线
          &:last-child
            border-none()
          .text
            line-height: 16px
            font-size: 12px
            font-weight: 200
            color: rgb(7, 17, 27)
    .pics
      padding: 18px 0 18px 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        font-size: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .pic-wrapper
        width: 100%
        overflow: hidden //超出部分隐藏
        white-space: nowrap // 不折行
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0
</style>
