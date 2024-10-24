<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { ref } from 'vue'
import './style.css'

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
