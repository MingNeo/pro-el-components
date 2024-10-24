import type MarkdownIt from 'markdown-it'
import markdownit from 'markdown-it'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

let md: markdownit | null = null

interface MarkdownItOptions extends MarkdownIt.Options {
  escapeHtml?: boolean
}

function markDownItCodeSection(md: MarkdownIt, isEscapeHtml = true) {
  const { escapeHtml } = md.utils
  // 为复制功能绑定点击事件，点击自动复制code的内容
  try {
    document.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('.md-code-section__copy')
      if (target) {
        const code = target.parentElement?.nextElementSibling?.querySelector('code')
        if (code?.textContent) {
          copyToClipboard(code.textContent)
          target.classList.add('success')
          setTimeout(() => target.classList.remove('success'), 1000)
        }
      }
    })
  }
  catch (error) {
    console.error(error)
  }

  // markdown中的html应该转义以防止被解析
  md.renderer.rules.html_inline = (tokens, idx) => {
    return isEscapeHtml ? escapeHtml(tokens[idx].content.trim()) : tokens[idx].content.trim()
  }
  md.renderer.rules.html_block = (tokens, idx) => {
    return isEscapeHtml
      ? `${escapeHtml(tokens[idx].content.trim())}<br />`
      : `${tokens[idx].content.trim()}<br />`
  }

  md.renderer.rules.fence = (tokens, idx) => {
    const { info, content = '' } = tokens[idx]
    const lang = { vue: 'html', htm: 'html' }[info] || info || 'txt'
    let str = content.trim()

    str = Prism.languages[lang]
      ? Prism.highlight(
        str,
        Prism.languages[lang],
        lang,
      )
      : str

    return `<div class="md-code-section__container">
  <div class="md-code-section__languagebar">
    <span>${info}</span>
    <span class="md-code-section__copy">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
          <path fill="currentColor" d="M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8m-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z"/>
        </svg>
        复制
      </span>
      <span class="md-code-section__copy-success">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7L10 17l-5-5"/>
        </svg>
        已复制!
      </span>
    </span>
  </div>
  <pre class="md-code-section__code language-${lang}"><code>${str}</code></pre>
</div>`.trim()
  }
}

export function renderMarkdown(text: string, options: MarkdownItOptions = {}) {
  // 只有使用时才生成实例
  if (!md) {
    md = markdownit({
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
      ...options,
    })
    md.use(markDownItCodeSection, options.escapeHtml)
  }
  return md.render(text)
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText ? navigator.clipboard.writeText(text) : document.execCommand('copy')
}
