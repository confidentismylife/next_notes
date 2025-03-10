# 选项卡 Tabs

选项卡切换组件，用于在不同的内容区域之间进行切换。

## 基本用法

基础的、简洁的选项卡，常用于较为简单的分组切换。

```jsx
import { Tabs } from 'Pntd'

const { TabPane } = Tabs

export default function BasicTabsDemo() {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="选项卡1" key="1">
        选项卡1的内容区域
      </TabPane>
      <TabPane tab="选项卡2" key="2">
        选项卡2的内容区域
      </TabPane>
      <TabPane tab="选项卡3" key="3">
        选项卡3的内容区域
      </TabPane>
    </Tabs>
  )
}
```

## 卡片式选项卡

卡片式的页签，常用于容器顶部。

```jsx
import { Tabs } from 'Pntd'

const { TabPane } = Tabs

export default function CardTabsDemo() {
  return (
    <Tabs defaultActiveKey="1" type="card">
      <TabPane tab="选项卡1" key="1">
        选项卡1的内容区域
      </TabPane>
      <TabPane tab="选项卡2" key="2">
        选项卡2的内容区域
      </TabPane>
      <TabPane tab="选项卡3" key="3">
        选项卡3的内容区域
      </TabPane>
    </Tabs>
  )
}
```

## 禁用某个选项卡

通过 `disabled` 属性禁用某个选项卡。

```jsx
import { Tabs } from 'Pntd'

const { TabPane } = Tabs

export default function DisabledTabDemo() {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="选项卡1" key="1">
        选项卡1的内容区域
      </TabPane>
      <TabPane tab="选项卡2" key="2" disabled>
        选项卡2的内容区域
      </TabPane>
      <TabPane tab="选项卡3" key="3">
        选项卡3的内容区域
      </TabPane>
    </Tabs>
  )
}
```

## 居中显示

通过 `centered` 属性使标签居中显示。

```jsx
import { Tabs } from 'Pntd'

const { TabPane } = Tabs

export default function CenteredTabsDemo() {
  return (
    <Tabs defaultActiveKey="1" centered>
      <TabPane tab="选项卡1" key="1">
        选项卡1的内容区域
      </TabPane>
      <TabPane tab="选项卡2" key="2">
        选项卡2的内容区域
      </TabPane>
      <TabPane tab="选项卡3" key="3">
        选项卡3的内容区域
      </TabPane>
    </Tabs>
  )
}
```

## 附加内容

可以在页签右边添加额外的操作区域。

```jsx
import { Tabs, Button } from 'Pntd'

const { TabPane } = Tabs

export default function TabsWithExtraDemo() {
  return (
    <Tabs 
      defaultActiveKey="1" 
      extra={<Button size="sm">额外操作</Button>}
    >
      <TabPane tab="选项卡1" key="1">
        选项卡1的内容区域
      </TabPane>
      <TabPane tab="选项卡2" key="2">
        选项卡2的内容区域
      </TabPane>
      <TabPane tab="选项卡3" key="3">
        选项卡3的内容区域
      </TabPane>
    </Tabs>
  )
}
```

## API

### Tabs

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| activeKey | 当前激活 tab 面板的 key | `string` | - |
| defaultActiveKey | 初始化选中面板的 key | `string` | 第一个面板的 key |
| type | 页签的基本样式 | `'line' \| 'card'` | `'line'` |
| size | 大小 | `'large' \| 'default' \| 'small'` | `'default'` |
| centered | 标签居中展示 | `boolean` | `false` |
| onChange | 切换面板的回调 | `(activeKey: string) => void` | - |
| onTabClick | tab 被点击的回调 | `(key: string, event: MouseEvent) => void` | - |
| extra | tab bar 上额外的元素 | `ReactNode` | - |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |

### TabPane

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| key | 对应 activeKey | `string` | - |
| tab | 选项卡头显示文字 | `ReactNode` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - | 