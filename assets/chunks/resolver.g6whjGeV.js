const n=`import type { ComponentResolver } from 'unplugin-vue-components/types'

/**
 * ProElComponents 组件解析器
 *
 * @example
 * \`\`\`ts
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import Components from 'unplugin-vue-components/vite'
 * import { ProElComponentsResolver } from 'pro-el-components/resolver'
 *
 * export default defineConfig({
 *   plugins: [
 *     Components({
 *       resolvers: [
 *         // 默认自动导入样式
 *         ProElComponentsResolver(),
 *
 *         // 或者自定义配置
 *         ProElComponentsResolver({
 *           importStyle: true,  // 是否导入样式，默认true
 *           dirName: 'components' // 样式文件目录，可选 'es' | 'lib' | 'components'
 *         })
 *       ],
 *     }),
 *   ],
 * })
 * \`\`\`
 */

/**
 * ProElComponents 组件解析器选项
 */
interface ProElComponentsResolverOptions {
  /**
   * 是否自动导入样式
   * @default true
   */
  importStyle?: boolean
  /**
   * 样式导入的目录前缀，可选值：'es' | 'lib' | 'components'
   * @default 'components'
   */
  dirName?: string
}

/**
 * ProElComponents 组件解析器
 * 用于自动导入组件和样式
 */
export function ProElComponentsResolver(options: ProElComponentsResolverOptions = {}): ComponentResolver {
  const { importStyle = true } = options

  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith('Pro') && !['Promise', 'ProElComponentsResolver'].includes(name)) {
        const componentName = name.slice(3) // 移除 'Pro' 前缀
        const resolveResult: any = {
          name,
          from: 'pro-el-components',
        }

        // 如果启用样式导入，添加样式文件路径
        if (importStyle) {
          const stylePath = \`pro-el-components/components/\${componentName}/style.css\`
          if (stylePath) {
            resolveResult.sideEffects = [stylePath]
          }
        }

        return resolveResult
      }
    },
  }
}

// 导出默认解析器
export default ProElComponentsResolver
`;export{n as default};
