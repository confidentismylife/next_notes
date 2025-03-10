# 按钮 Button

常用的操作按钮，用于触发点击事件。

## 基本用法

按钮有四种类型：默认按钮、主要按钮、危险按钮和链接按钮。

```jsx
import { Button } from 'Pntd'

export default function ButtonDemo() {
  return (
    <div>
      <Button>默认按钮</Button>
      <Button btnType="primary">主要按钮</Button>
      <Button btnType="danger">危险按钮</Button>
      <Button btnType="link" href="https://www.example.com">链接按钮</Button>
    </div>
  )
}
```

## 按钮尺寸

按钮有三种尺寸：大型按钮、中型按钮（默认）和小型按钮。

```jsx
import { Button } from 'Pntd'

export default function ButtonSizeDemo() {
  return (
    <div>
      <Button size="lg">大型按钮</Button>
      <Button>默认按钮</Button>
      <Button size="sm">小型按钮</Button>
    </div>
  )
}
```

## 禁用状态

添加 `disabled` 属性可以将按钮设置为禁用状态。

```jsx
import { Button } from 'Pntd'

export default function DisabledButtonDemo() {
  return (
    <div>
      <Button disabled>禁用按钮</Button>
      <Button btnType="primary" disabled>禁用主要按钮</Button>
      <Button btnType="link" disabled href="https://www.example.com">禁用链接</Button>
    </div>
  )
}
```

## API

### 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| btnType | 设置按钮类型 | `'default' \| 'primary' \| 'danger' \| 'link'` | `'default'` |
| size | 设置按钮大小 | `'lg' \| 'sm'` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |
| href | 当 `btnType` 为 `'link'` 时，设置链接地址 | `string` | - |
| children | 按钮内容 | `React.ReactNode` | - |

除了以上属性，`Button` 组件还支持原生 `button` 元素或 `a` 元素（当 `btnType` 为 `'link'` 时）的所有属性。 