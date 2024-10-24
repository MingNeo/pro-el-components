<script lang="ts" setup>
  import { debounce } from 'lodash-es'
  import { ref } from 'vue'

  const container = ref()
  const translateX = ref(0) // 位移
  const showAnimate = ref(false)

  function getMaxOffset() {
    const contentWidth = container.value.querySelector('.swiper-tab-content').scrollWidth
    return contentWidth - (container.value?.offsetWidth || 0)
  }

  function moveLeft() {
    if (translateX.value > 0) {
      setShowAnimate()
      const itemWidth = (container.value.querySelector('.swiper-tab-content').children?.[0]?.offsetWidth || 0) + 8
      setTranslateX(translateX.value - itemWidth)
    }
  }

  function moveRight() {
    if (translateX.value <= getMaxOffset()) {
      setShowAnimate()
      const itemWidth = (container.value.querySelector('.swiper-tab-content').children?.[0]?.offsetWidth || 0) + 8
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
  <div v-bind="$attrs" ref="container" class="swiper-tab group relative flex" @mouseenter="handleCheckShowBtn">
    <div v-show="showLeft" class="flex absolute left-[-30px] w-6 cursor-pointer h-full" @click="moveLeft">
      <div class="icon-btn-box shadow hidden group-hover:flex hover:bg-[#4b5bfe] hover:text-white text-[#8490FE] text-[11px] items-center justify-center w-6 h-6 bg-white rounded-[50%]">
        <!-- <Icon icon="ai-eyes:left" /> -->
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 1024 1024" class="iconify iconify--ai-eyes">
          <path d="M719.104 100.693333a64 64 0 0 1 0.512 90.538667L406.272 508.245333 720.213333 833.194667a64 64 0 1 1-92.074666 88.917333L292.693333 574.890667A96.341333 96.341333 0 0 1 293.546667 440.32l335.018666-339.029333a64 64 0 0 1 90.538667-0.597334z" />
        </svg>
      </div>
    </div>
    <div class="swiper-tab-container absolute left-0 top-0 w-full overflow-hidden h-full" :class="{ 'show-left': showLeft, 'show-right': showRight }">
      <div class="swiper-tab-content min-w-0 whitespace-nowrap" :class="[showAnimate && 'transition-transform transition-duration-.8s transition-ease-out']" :style="{ transform: `translateX(calc(-${translateX}px)` }">
        <slot />
      </div>
    </div>

    <div v-show="true || showRight" class="group absolute right-[-30px] h-full w-6 cursor-pointer h-full" @click="moveRight">
      <div class="icon-btn-box hidden group-hover:flex shadow hover:bg-[#4b5bfe] hover:text-white text-[#8490FE] text-[11px] items-center justify-center w-6 h-6 bg-white rounded-[50%]">
        <!-- <Icon icon="ai-eyes:right" /> -->
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 1024 1024">
          <path d="M304.896 923.306667a64 64 0 0 1-0.512-90.538667l313.344-317.013333L303.786667 190.805333A64 64 0 1 1 395.946667 101.888l335.36 347.221333a96.341333 96.341333 0 0 1-0.853334 134.570667l-335.018666 339.029333a64 64 0 0 1-90.538667 0.512z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style>
  .swiper-tab {
    user-select: none;
  }

  .swiper-tab-container.show-left:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 100%;
    background: linear-gradient(to right, var(--background-white), rgba(255, 255, 255, 0));
    z-index: 1;
  }

  .swiper-tab-container.show-right:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 100%;
    background: linear-gradient(to left, var(--background-white), rgba(255, 255, 255, 0));
    z-index: 1;
  }

  .swiper-tab-content>div,
  .swiper-tab-content>li,
  .swiper-tab-content>ul {
    display: inline-block;
    margin-right: 8px;
  }

  .swiper-tab-content .active,
  .swiper-tab-content :hover,
  .swiper-tab-content :focus {
    .tab-item-button {
      display: flex;
    }
  }

  .swiper-tab-content :last-child {
    margin-right: 0 !important;
  }

  .icon-btn-box {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
