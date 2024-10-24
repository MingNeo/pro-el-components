<script lang="ts" setup>
import { InfoFilled } from '@element-plus/icons-vue'
import { ElIcon, ElTooltip } from 'element-plus'
import { computed, ref } from 'vue'

interface RatingItem {
  score: number
  comment: string
}

interface RatingDimension {
  key: string
  name: string
  description: string
}

const props = withDefaults(defineProps<{
  modelValue?: Record<string, RatingItem>
  viewMode?: boolean
  dimensions?: RatingDimension[]
  maxScore?: number
}>(), {
  dimensions: () => [],
})

const emit = defineEmits(['update:modelValue', 'change'])

const maxScore = props.maxScore || 5

// 初始化评分数据
const ratings = ref<Record<string, RatingItem>>(
  props.modelValue
  || Object.fromEntries(
    props.dimensions.map(d => [d.key, { score: 0, comment: '' }]),
  ),
)

// 计算总分
const totalScore = computed(() => {
  const scores = Object.values(ratings.value).map(item => item.score)
  const sum = scores.reduce((a, b) => a + b, 0)
  return sum / scores.length
})

// 更新评分
function updateRating(dimension: string, field: 'score' | 'comment', value: number | string) {
  ratings.value[dimension] = {
    ...ratings.value[dimension],
    [field]: value,
  }

  emit('update:modelValue', ratings.value)
  emit('change', ratings.value)
}

// 生成分数选项
const scoreOptions = Array.from({ length: maxScore + 1 }, (_, i) => i)
</script>

<template>
  <p>自定义组件</p>
  <div class="rating-matrix w-full p-4 border border-solid border-gray-200 rounded">
    <!-- 查看模式 -->
    <template v-if="viewMode">
      <div class="rating-summary mt-5 pt-4 border-solid border-0 border-t border-gray-200">
        <div class="total-score text-base font-medium text-right text-gray-800">
          总评分: {{ totalScore.toFixed(1) }}
        </div>
      </div>
      <div class="rating-list flex flex-col gap-5">
        <div
          v-for="dim in dimensions"
          :key="dim.key"
          class="rating-item border-solid border-0 border-b border-b-gray-100 pb-4"
        >
          <div class="dimension-info flex justify-between mb-1">
            <div class="dimension-name font-medium text-gray-800">
              {{ dim.name }}
            </div>
            <div class="dimension-score text-primary font-medium">
              {{ ratings[dim.key].score }}分
            </div>
          </div>
          <div v-if="ratings[dim.key].comment" class="dimension-comment text-gray-500 text-sm mt-1">
            {{ ratings[dim.key].comment }}
          </div>
        </div>
      </div>
    </template>

    <!-- 编辑模式 -->
    <template v-else>
      <div class="rating-list flex flex-col gap-5">
        <div
          v-for="dim in dimensions"
          :key="dim.key"
          class="rating-item border-solid border-0 border-b border-gray-100 pb-4"
        >
          <div class="dimension-header flex items-center gap-2 mb-2">
            <span class="dimension-name font-medium text-gray-800">{{ dim.name }}</span>
            <ElTooltip :content="dim.description" placement="top">
              <ElIcon><InfoFilled /></ElIcon>
            </ElTooltip>
          </div>

          <div class="rating-controls flex flex-col gap-3">
            <div class="score-selector flex gap-2">
              <template v-for="score in scoreOptions" :key="score">
                <div
                  class="score-option w-8 h-8 flex items-center justify-center border border-solid border-gray-300 rounded cursor-pointer transition-all"
                  :class="{ 'bg-primary border-primary text-white': ratings[dim.key].score === score, 'hover:border-primary hover:text-primary': ratings[dim.key].score !== score }"
                  @click="updateRating(dim.key, 'score', score)"
                >
                  {{ score }}
                </div>
              </template>
            </div>

            <ElInput
              v-model="ratings[dim.key].comment"
              type="textarea"
              :rows="2"
              placeholder="添加评语（可选）"
              @input="(value: any) => updateRating(dim.key, 'comment', value)"
            />
          </div>
        </div>
      </div>

      <div class="rating-summary mt-5 pt-4 border-solid border-0 border-t border-gray-200">
        <div class="total-score text-base font-medium text-right text-gray-800">
          总评分: {{ totalScore.toFixed(1) }}
        </div>
      </div>
    </template>
  </div>
</template>
