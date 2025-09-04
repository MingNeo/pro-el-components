const n=`<script setup lang="ts">
import { useUrlData } from '.'

const { urlData, setUrlParam, resetUrlData, removeUrlParam } = useUrlData({
  defaults: {
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt',
  },
})

// 示例方法
function handleSearch(keyword: string) {
  setUrlParam('search', keyword)
}

function handlePageChange(page: number) {
  setUrlParam('page', page)
}

function handleTagsChange(tags: string[]) {
  setUrlParam('tags', tags)
}

function handleReset() {
  resetUrlData()
}

function handleRemoveSearch() {
  removeUrlParam('search')
}
<\/script>

<template>
  <div class="url-data-demo">
    <div class="control-panel">
      <!-- 搜索示例 -->
      <div class="search-box">
        <input
          type="text"
          :value="urlData.search"
          placeholder="输入搜索关键词"
          @input="e => handleSearch((e.target as HTMLInputElement).value)"
        >
        <button @click="handleRemoveSearch">
          清除搜索
        </button>
      </div>

      <!-- 分页示例 -->
      <div class="pagination">
        <button
          :disabled="urlData.page <= 1"
          @click="handlePageChange(urlData.page - 1)"
        >
          上一页
        </button>
        <span>第 {{ urlData.page }} 页</span>
        <button @click="handlePageChange(urlData.page + 1)">
          下一页
        </button>
      </div>

      <!-- 标签示例 -->
      <div class="tags">
        <button
          v-for="tag in ['vue', 'react', 'angular']"
          :key="tag"
          :class="{ active: urlData.tags?.includes(tag) }"
          @click="handleTagsChange(
            urlData.tags?.includes(tag)
              ? urlData.tags.filter(t => t !== tag)
              : [...(urlData.tags || []), tag],
          )"
        >
          {{ tag }}
        </button>
      </div>

      <!-- 重置按钮 -->
      <button class="reset-btn" @click="handleReset">
        重置所有
      </button>
    </div>

    <!-- 当前 URL 参数展示 -->
    <div class="current-state">
      <h3>当前 URL 参数：</h3>
      <pre>{{ urlData }}</pre>
    </div>
  </div>
</template>

<style scoped>
  .url-data-demo {
    padding: 20px;
  }

  .control-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .search-box {
    display: flex;
    gap: 8px;
  }

  .search-box input {
    padding: 8px;
    flex: 1;
  }

  .pagination {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .tags {
    display: flex;
    gap: 8px;
  }

  .tags button.active {
    background-color: #4CAF50;
    color: white;
  }

  button {
    padding: 8px 16px;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .current-state {
    padding: 16px;
    background-color: #f5f5f5;
    border-radius: 4px;
  }

  pre {
    margin: 0;
    white-space: pre-wrap;
  }
</style>
`;export{n as default};
