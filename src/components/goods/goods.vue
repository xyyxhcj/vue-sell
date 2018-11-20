<template>
  <div class="goods">
    <div class="menu-wrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'active':index === currentIndex}"
            @click="selectMenu(index,$event)" ref="menu-list-hook">
          <span class="text border-1px">
            <class-map v-show="item.type > 0" :index="item.type" :num="3"></class-map>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper">
      <ul>
        <li v-for="(item,index) in goods" class="food-list" :key="index" ref="food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food,index_f) in item.foods" class="food-item border-1px" :key="index_f"
                @click="selectFood(food,$event)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon"/>
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating ? food.rating : 0}}%</span>
                </div>
                <div class="price">
                  <span class="now"><span class="char">￥</span>{{food.price}}</span><span class="old"
                                                                                          v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartControl-wrapper">
                  <!--'@cart-add="_drop"':用于侦听子组件传递的事件-->
                  <cart-control :food="food" @cart-add="_drop"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shop-cart ref="shopCart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"
               :select-foods="selectFoods"></shop-cart>
    <food :food="selectedFood" ref="food" @cart-add="_drop"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import classMap from '@/components/classMap/classMap';
  import BScroll from 'better-scroll'; // 滚动条JS
  import shopCart from '@/components/shopCart/shopCart';
  import cartControl from '@/components/cartControl/cartControl';
  import food from '@/components/food/food';
  import {CONSTANT} from '@/common/js/constant';

  // 二分查找
  function binarySearch(list, target, begin = 0, end = null) {
    if (end === null) {
      end = list.length - 1;
    }
    let index = (end + begin) >> 1;
    if (list[index] < target) {
      begin = index + 1;
    } else if (list[index] > target) {
      end = index - 1;
    } else {
      return index;
    }
    if (begin > end) {
      // 返回-(1+应该所在位置的索引)
      return -(1 + begin);
    }
    return binarySearch(list, target, begin, end);
  }

  export default {
    name: 'goods',
    props: {'seller': Object},
    data: function () {
      return {
        goods: [],
        menuScroll: Object,
        foodScroll: Object,
        heightList: [],
        heightElements: [],
        menuElements: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    created() {
      this.$http.get(process.env.HOST + '/api/goods').then(response => {
        let result = response.body;
        if (CONSTANT.RESULT_CODE.SUCCESS === result.errno) {
          this.$data.goods = result.data;
          // 当dom渲染完毕时再执行
          this.$nextTick(() => {
            this._initScroll();
            this._saveHeightMap();
          });
        }
      }, response => {
      });
    },
    components: {
      classMap, shopCart, cartControl, food
    },
    methods: {
      // 初始化滚动条
      _initScroll() {
        // 'click: true':开启移动端派发点击事件
        this.menuScroll = new BScroll('.menu-wrapper', {click: true});
        // 'probeType: 3':开启实时获取滚动位置; 默认0,不派发scroll事件
        // probeType:为1时会非实时派发scroll事件;为2时会实时派发scroll事件;为3时在屏幕滑动和momentum滚动动画运行过程中实时派发scroll事件
        this.foodScroll = new BScroll('.foods-wrapper', {probeType: 3, click: true});
        // 监听滚动事件,获取Y坐标
        this.foodScroll.on('scroll', position => {
          this.scrollY = Math.abs(Math.round(position.y));
          this.selectGood();
        });
      },
      _saveHeightMap() {
        let foodList = this.$refs['food-list-hook'];
        let menuList = this.$refs['menu-list-hook'];
        for (let i = 0, height = 0; i < foodList.length; i++) {
          this.heightList.push(height);
          this.heightElements.push(foodList[i]);
          this.menuElements.push(menuList[i]);
          // 累加每个div的高度
          height += foodList[i].clientHeight;
        }
      },
      selectMenu(index, event) {
        // PC端会触发两次事件,仅监控vue派发的监听事件(Vue派发事件的event._constructed为true)
        if (event._constructed) {
          // 获取选择的dom元素
          let el = this.heightElements[index];
          // 滚动到指定的dom元素位置,'100':滚动动画时间(单位毫秒)
          this.foodScroll.scrollToElement(el, 100);
        }
      },
      selectGood() {
        let index = this.currentIndex;
        // 获取当前位置及目标位置,当超过指定距离时进行滚动
        let currentY = Math.abs(this.menuScroll.y);
        let targetY = this.heightList[index];
        if ((targetY > currentY && (targetY - currentY) > 324) || targetY < currentY) {
          this.menuScroll.scrollToElement(this.menuElements[index], 300);
        }
      },
      _drop(target) {
        // 'this.$nextTick':异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopCart.drop(target);
        });
      },
      selectFood(food, event) {
        if (event._constructed) {
          this.selectedFood = food;
          this.$refs.food.show();
        }
      }
    },
    computed: {
      // 获取当前的滚动位置在数据中的index
      currentIndex() {
        let searchResult = binarySearch(this.heightList, this.scrollY);
        if (searchResult >= 0) {
          return searchResult;
        } else {
          return -searchResult - 2;
        }
      },
      selectFoods() {
        let foods = [];
        if (this.goods && this.goods instanceof Array) {
          this.goods.forEach(good => {
            good.foods.forEach(food => {
              if (food.count && food.count > 0) {
                foods.push(food);
              }
            });
          });
        }
        return foods;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    // 超出部分隐藏
    overflow: hidden
    .menu-wrapper
      // 设置弹性盒模型对象的子元素如何分配空间,flex是flex-grow,flex-shrink,flex-basis属性的简写
      // flex-grow:相对其他项的放大比例,0-不放大;flex-shrink:相对其他项的缩小比例,0-不缩小;flex-basis:设置固定长度
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        // 多行文字垂直居中 display: table + padding + display: table-cell + vertical-align: middle
        display: table
        height: 54px
        width: 56px
        /*text-align: center*/
        padding: 0 12px
        line-height: 14px
        // 当前选中域样式
        &.active
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          .text
            font-weight: 700
            border-none()
        .text
          // 实现多行文字垂直居中
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
          font-weight: 200px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        // 左侧固定,右侧自适应
        display: flex
        //margin: 18px
        //padding-bottom: 18px
        padding: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          // 最后一个元素不显示下边框
          border-none()
        /*margin-bottom: 0*/
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          margin-left: 10px
          .name
            margin: 2px 0 8px
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            margin-bottom: 8px
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
          .extra .count
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
            right: 0
            bottom: 12px
</style>
