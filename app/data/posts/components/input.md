# 输入框 Input

输入框允许用户输入和编辑文本，是表单中最基础的数据录入组件。

## 基本用法

最基础的输入框，支持所有HTML input的原生属性。

```jsx
import { Input } from 'Pntd'

export default function InputDemo() {
  return <Input placeholder="请输入内容" />
}
```

## 不同尺寸

输入框有三种尺寸：大、默认、小。

```jsx
import { Input } from 'Pntd'

export default function InputSizeDemo() {
  return (
    <div className="input-demo">
      <Input size="lg" placeholder="大型输入框" />
      <Input placeholder="默认输入框" />
      <Input size="sm" placeholder="小型输入框" />
    </div>
  )
}
```

## 禁用状态

通过设置 `disabled` 属性禁用输入框。

```jsx
import { Input } from 'Pntd'

export default function DisabledInputDemo() {
  return <Input disabled placeholder="禁用状态" />
}
```

## 带图标的输入框

可以添加图标用于提示或操作。

```jsx
import { Input } from 'Pntd'

export default function IconInputDemo() {
  return <Input icon="search" placeholder="搜索内容" />
}
```

## 前缀和后缀

可以在输入框前后添加额外的元素或文本。

```jsx
import { Input } from 'Pntd'

export default function AffixInputDemo() {
  return (
    <div className="input-demo">
      <Input prepend="https://" placeholder="请输入网址" />
      <Input append=".com" placeholder="请输入域名" />
      <Input prepend="https://" append=".com" placeholder="请输入网站名" />
    </div>
  )
}
```

## API

### Input

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| disabled | 是否禁用状态 | `boolean` | `false` |
| size | 输入框大小 | `'lg' \| 'sm'` | - |
| icon | 带图标的输入框 | `IconProp` | - |
| prepend | 带标签的输入框，设置前置标签 | `ReactNode` | - |
| append | 带标签的输入框，设置后置标签 | `ReactNode` | - |
| onChange | 输入框内容变化时的回调 | `(e: ChangeEvent) => void` | - |
| value | 输入框内容 | `string \| number` | - |

除了上述API外，Input组件也支持原生input的所有属性。 