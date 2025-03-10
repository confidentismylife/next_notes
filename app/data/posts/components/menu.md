# 菜单 Menu

为页面和功能提供导航的菜单列表。

## 基本用法

水平的顶部导航菜单，最基本的用法。

```jsx
import { Menu } from 'Pntd'

const { MenuItem } = Menu

export default function BasicMenuDemo() {
  return (
    <Menu activeIndex={0} mode="horizontal">
      <MenuItem>首页</MenuItem>
      <MenuItem>产品</MenuItem>
      <MenuItem>博客</MenuItem>
      <MenuItem>关于我们</MenuItem>
    </Menu>
  )
}
```

## 垂直菜单

垂直菜单，常用于页面的侧边栏。

```jsx
import { Menu } from 'Pntd'

const { MenuItem } = Menu

export default function VerticalMenuDemo() {
  return (
    <Menu activeIndex={0} mode="vertical" style={{ width: '200px' }}>
      <MenuItem>个人信息</MenuItem>
      <MenuItem>账户设置</MenuItem>
      <MenuItem>消息通知</MenuItem>
      <MenuItem>隐私设置</MenuItem>
    </Menu>
  )
}
```

## 子菜单

包含多级菜单的导航，通过 `SubMenu` 来嵌套子菜单。

```jsx
import { Menu } from 'Pntd'

const { MenuItem, SubMenu } = Menu

export default function SubMenuDemo() {
  return (
    <Menu mode="horizontal">
      <MenuItem>首页</MenuItem>
      <SubMenu title="产品">
        <MenuItem>产品列表</MenuItem>
        <MenuItem>产品详情</MenuItem>
        <MenuItem>新品推荐</MenuItem>
      </SubMenu>
      <SubMenu title="解决方案">
        <MenuItem>金融解决方案</MenuItem>
        <MenuItem>医疗解决方案</MenuItem>
        <SubMenu title="教育解决方案">
          <MenuItem>K12教育</MenuItem>
          <MenuItem>高等教育</MenuItem>
        </SubMenu>
      </SubMenu>
      <MenuItem>联系我们</MenuItem>
    </Menu>
  )
}
```

## 禁用菜单项

通过设置 `disabled` 属性来禁用菜单项。

```jsx
import { Menu } from 'Pntd'

const { MenuItem, SubMenu } = Menu

export default function DisabledMenuDemo() {
  return (
    <Menu mode="horizontal">
      <MenuItem>可用菜单项</MenuItem>
      <MenuItem disabled>禁用菜单项</MenuItem>
      <SubMenu title="子菜单">
        <MenuItem>子菜单项1</MenuItem>
        <MenuItem disabled>禁用子菜单项</MenuItem>
      </SubMenu>
    </Menu>
  )
}
```

## 自定义选中项

通过 `activeIndex` 和 `onSelect` 属性实现菜单项的选中控制。

```jsx
import { Menu } from 'Pntd'
import { useState } from 'react'

const { MenuItem } = Menu

export default function ControlledMenuDemo() {
  const [activeIndex, setActiveIndex] = useState(0)
  
  return (
    <Menu 
      mode="horizontal" 
      activeIndex={activeIndex}
      onSelect={(index) => setActiveIndex(index)}
    >
      <MenuItem>菜单项 1</MenuItem>
      <MenuItem>菜单项 2</MenuItem>
      <MenuItem>菜单项 3</MenuItem>
      <MenuItem>菜单项 4</MenuItem>
    </Menu>
  )
}
```

## API

### Menu

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| mode | 菜单类型，现在支持垂直、水平两种模式 | `'vertical' \| 'horizontal'` | `'horizontal'` |
| activeIndex | 当前选中的菜单项索引 | `number` | `0` |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |
| onSelect | 菜单被选中时的回调 | `(selectedIndex: number) => void` | - |

### MenuItem

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| disabled | 是否禁用 | `boolean` | `false` |
| index | 菜单项索引（一般由父组件Menu传入，不需要手动指定） | `number` | - |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |

### SubMenu

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 子菜单标题 | `ReactNode` | - |
| index | 子菜单索引（一般由父组件Menu传入，不需要手动指定） | `number` | - |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - | 