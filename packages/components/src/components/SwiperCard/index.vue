<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { ref } from 'vue'

defineOptions({
  name: 'ProSwiperCard',
})

const container = ref()
const translateX = ref(0) // 位移
const showAnimate = ref(false)

function getMaxOffset() {
  const contentWidth = container.value.querySelector('.pro-swiper-card-content').scrollWidth
  return contentWidth - (container.value?.offsetWidth || 0)
}

function moveLeft() {
  if (translateX.value > 0) {
    setShowAnimate()
    const itemWidth = (container.value.querySelector('.pro-swiper-card-content').children?.[0]?.offsetWidth || 0) + 8
    setTranslateX(translateX.value - itemWidth)
  }
}

function moveRight() {
  if (translateX.value <= getMaxOffset()) {
    setShowAnimate()
    const itemWidth = (container.value.querySelector('.pro-swiper-card-content').children?.[0]?.offsetWidth || 0) + 8
    setTranslateX(translateX.value + itemWidth)
  }
}

function setTranslateX(x: number) {
  translateX.value = x > getMaxOffset() ? getMaxOffset() : x < 0 ? 0 : x
}

function setShowAnimate() {
  showAnimate.value = true
  debounce(() => {
    showAnimate.value = false
  }, 800)
}

const showLeft = ref(false)
const showRight = ref(false)
function handleCheckShowBtn() {
  showLeft.value = translateX.value > 0
  showRight.value = translateX.value < getMaxOffset()
}
</script>

<template>
  <div v-bind="$attrs" ref="container" class="pro-swiper-card group relative flex" @mouseenter="handleCheckShowBtn">
    <div v-show="showLeft" class="swiper-left-btn" @click="moveLeft">
      <div class="icon-btn-box">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 1024 1024" class="iconify iconify--ai-eyes">
          <path d="M719.104 100.693333a64 64 0 0 1 0.512 90.538667L406.272 508.245333 720.213333 833.194667a64 64 0 1 1-92.074666 88.917333L292.693333 574.890667A96.341333 96.341333 0 0 1 293.546667 440.32l335.018666-339.029333a64 64 0 0 1 90.538667-0.597334z" />
        </svg>
      </div>
    </div>
    <div class="pro-swiper-card-container" :class="{ 'show-left': showLeft, 'show-right': showRight }">
      <div class="pro-swiper-card-content" :class="[showAnimate && 'transition-animate']" :style="{ transform: `translateX(calc(-${translateX}px)` }">
        <slot />
      </div>
    </div>

    <div v-show="true || showRight" class="swiper-right-btn" @click="moveRight">
      <div class="icon-btn-box">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 1024 1024">
          <path d="M304.896 923.306667a64 64 0 0 1-0.512-90.538667l313.344-317.013333L303.786667 190.805333A64 64 0 1 1 395.946667 101.888l335.36 347.221333a96.341333 96.341333 0 0 1-0.853334 134.570667l-335.018666 339.029333a64 64 0 0 1-90.538667 0.512z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style>
  .pro-swiper-card {
    user-select: none;
  }

  .pro-swiper-card-container.show-left:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 100%;
    background: linear-gradient(to right, var(--background-white), rgba(255, 255, 255, 0));
    z-index: 1;
  }

  .pro-swiper-card-container.show-right:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 100%;
    background: linear-gradient(to left, var(--background-white), rgba(255, 255, 255, 0));
    z-index: 1;
  }

  .pro-swiper-card-content>div,
  .pro-swiper-card-content>li,
  .pro-swiper-card-content>ul {
    display: inline-block;
    margin-right: 8px;
  }

  .pro-swiper-card-content .active,
  .pro-swiper-card-content :hover,
  .pro-swiper-card-content :focus {
    .tab-item-button {
      display: flex;
    }
  }

  .pro-swiper-card-content :last-child {
    margin-right: 0 !important;
  }

  .icon-btn-box {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    display: none;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: white;
    border-radius: 50%;
    color: #8490fe;
    font-size: 11px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }

  .pro-swiper-card:hover .icon-btn-box {
    display: flex;
  }

  .icon-btn-box:hover {
    background-color: #4b5bfe;
    color: white;
  }

  .swiper-left-btn {
    display: flex;
    position: absolute;
    left: -30px;
    width: 24px;
    cursor: pointer;
    height: 100%;
  }

  .swiper-right-btn {
    position: absolute;
    right: -30px;
    height: 100%;
    width: 24px;
    cursor: pointer;
  }

  .pro-swiper-card-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    overflow: hidden;
    height: 100%;
  }

  .pro-swiper-card-content {
    min-width: 0;
    white-space: nowrap;
  }

  .pro-swiper-card-content.transition-animate {
    transition-property: transform;
    transition-duration: 0.8s;
    transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
</style>
