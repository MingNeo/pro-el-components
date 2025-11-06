import { computed, onUnmounted, ref, watch } from 'vue'

export function useSecondsCountdown(time: number, {
  callback,
  formatTime = (time: number) => String(time).padStart(2, '0'),
  duration = 1000,
}: {
  callback?: () => void
  formatTime?: (time: number) => string
  duration?: number
} = {}) {
  const current = ref(time)
  const isCounting = ref(false)

  let timer: number | undefined

  const stop = () => {
    window.clearInterval(timer)
    current.value = 0
    isCounting.value = false
  }

  const start = () => {
    if (typeof window !== 'undefined') {
      current.value = time
      isCounting.value = true
      timer = window.setInterval(() => {
        current.value -= 1
        if (current.value <= 0) {
          stop()
          callback?.()
        }
      }, duration)
    }
  }

  onUnmounted(stop)

  const formattedTime = computed(() => formatTime(current.value))

  watch(current, (val) => {
    if (val === 0)
      stop()
  })

  return { start, stop, current, formattedTime, isCounting }
}
