<template>
  <div class="ratingSelect">
    <div class="ratingType border-1px">
      <span class="block positive" :class="selectClass.all" @click="select(RATING_TYPE.ALL,$event)">{{desc.all}}<span
        class="count">{{ratings.length}}</span></span>
      <span class="block positive" :class="selectClass.positive" @click="select(RATING_TYPE.POSITIVE,$event)">{{desc.positive}}<span
        class="count">{{positives.length}}</span></span>
      <span class="block negative" :class="selectClass.negative" @click="select(RATING_TYPE.NEGATIVE,$event)">{{desc.negative}}<span
        class="count">{{negatives.length}}</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent}" @click="toggle($event)">
      <i class="icon-check_circle"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'ratingSelect',
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      },
      RATING_TYPE: Object,
      selectType: Number,
      onlyContent: Boolean
    },
    data() {
      return {};
    },
    computed: {
      selectClass() {
        return {
          all: this.selectType === this.RATING_TYPE.ALL ? 'active' : '',
          positive: this.selectType === this.RATING_TYPE.POSITIVE ? 'active' : '',
          negative: this.selectType === this.RATING_TYPE.NEGATIVE ? 'active' : ''
        };
      },
      positives() {
        return this.ratings.filter(rating => {
          return rating.rateType === this.RATING_TYPE.POSITIVE;
        });
      },
      negatives() {
        return this.ratings.filter(rating => {
          return rating.rateType === this.RATING_TYPE.NEGATIVE;
        });
      }
    },
    methods: {
      select(ratingType, event) {
        if (event._constructed) {
          // 'update:xxx':在子组件中修改父组件数据与'.sync'合并使用
          this.$emit('update:selectType', ratingType);
        }
      },
      toggle(event) {
        if (event._constructed) {
          this.$emit('update:onlyContent', !this.onlyContent);
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl";
  .ratingSelect
    .ratingType
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        border-radius: 1px
        font-size: 12px
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          margin-left: 2px
          font-size: 8px
        &.positive
          background: rgba(0, 160, 220, 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      color: rgb(147, 153, 159)
      font-size: 0
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        font-size: 12px
      &.on
        .icon-check_circle
          color: #00c850

</style>
