import type { ButtonProps as ElButtonProps } from 'element-plus'

export interface ButtonAction extends Partial<Omit<ElButtonProps, 'text' | 'onClick' | 'disabled' | 'type'>> {
  text?: string
  icon?: any
  onClick: (...args: any[]) => void
  show?: boolean | ((...args: any[]) => boolean)
  disabled?: boolean | ((...args: any[]) => boolean)
  danger?: boolean
  confirm?: boolean
  confirmText?: string
  permission?: string | string[]
  // 使用 string & {} ：保留字面量类型提示，同时接受任意 string
  type?: '' | 'text' | 'default' | 'success' | 'warning' | 'info' | 'primary' | 'danger' | (string & {})
  [x: string]: any
}

export interface ButtonActionsProps {
  actions?: ButtonAction[] | ((...args: any[]) => ButtonAction[])
  record?: Record<string, any>
  column?: Pick<ButtonActionsProps, 'column'> & { label?: string, prop?: string }
  index?: number
  hasPermission?: (permission: string | string[]) => boolean
  moreDropdownProps?: {
    placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'
    teleported?: boolean
  }
  maxCount?: number
  moreText?: string
  moreIcon?: any
  slotPriority?: boolean
  type?: 'link' | 'button'
  size?: 'small' | 'default' | 'large'
}
