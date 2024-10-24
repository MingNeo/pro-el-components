<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import { renderMarkdown } from './markdown'

  interface Props {
    showCursor?: boolean
    content?: string
  }

  const props = defineProps<Props>()
  const textRef = ref<HTMLElement>()
  const content = computed(() => renderMarkdown(props.content ?? ''))
</script>

<template>
  <div v-bind="$attrs" class="markdown-view-container text-base tracking-[1px] text-wrap min-w-[20px]">
    <div ref="textRef" class="markdown-view__content break-words">
      <div :class="`answer-content ${showCursor ? 'show-cursor' : ''}`" v-html="content" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .markdown-view-container :deep(.answer-content) {
    * {
      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--scrollbar-bg);
        border-radius: 4px;
      }
    }

    p,
    li,
    pre,
    h1,
    h2,
    h3,
    h4,
    h5,
    hr {
      overflow-wrap: break-word;
      margin-bottom: 6px;
    }

    p,
    li,
    pre {
      font-size: 15px;
    }

    h1 {
      font-size: 20px;
    }

    h2 {
      font-size: 18px;
    }

    h3 {
      font-size: 16px;
    }

    pre code {
      display: block;
      overflow-x: scroll;
      text-align: left;
    }

    p:last-child {
      margin-bottom: 0;
    }

    ul,
    ol {
      margin-left: 30px;

      li {
        list-style-type: auto;
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;

      th,
      td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }

      th {
        background-color: #f2f2f2;
      }

      tr:nth-child(even) {
        background-color: #fff;
      }
    }

    a {
      color: var(--primary-color, #3451b2);
      text-decoration: none;
    }

    &.show-cursor {
      >:last-child::after {
        content: '';
        display: inline-block;
        border-radius: 20px;
        width: 14px;
        height: 14px;
        background-color: var(--text-color);
        animation: blink 1s infinite;
        margin-left: 4px;

        @keyframes blink {

          0%,
          100% {
            opacity: 0;
          }

          50% {
            opacity: 1;
          }
        }
      }
    }

    .md-code-section__container {
      color: #c9d1d9;
      background: #0d1117;
      border-radius: 6px;
      margin-bottom: 16px;
      overflow-x: hidden;
      flex-shrink: 0;
      display: inline-grid;
      width: 100%;

      >pre {
        margin: 0 !important;

        code {
          display: block;
          overflow-x: scroll;
          text-align: left;
        }
      }

      .md-code-section__languagebar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 10px;
        font-size: 13px;
      }

      .md-code-section__copy {
        >span {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .md-code-section__copy-success {
          display: none;
        }

        &.success {
          color: #30c453;

          >span {
            display: none;
          }

          .md-code-section__copy-success {
            display: flex;
            color: #30c453;
          }
        }
      }
    }
  }
</style>
