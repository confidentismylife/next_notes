# 对话框 Modal

模态对话框是一种覆盖在当前页面之上的视图层，用于展示重要信息或需要用户进行操作的内容。

## 基本用法

最简单的对话框，通过控制 `visible` 属性来显示和隐藏。

```jsx
import { Modal, Button } from 'Pntd'
import { useState } from 'react'

export default function BasicModalDemo() {
  const [visible, setVisible] = useState(false)
  
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开对话框
      </Button>
      <Modal
        title="基础对话框"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <p>这是一个基础对话框，包含标题、内容区域和操作按钮。</p>
        <p>你可以在这里放置任何内容。</p>
      </Modal>
    </>
  )
}
```

## 自定义按钮文字

可以自定义确认按钮和取消按钮的文字。

```jsx
import { Modal, Button } from 'Pntd'
import { useState } from 'react'

export default function CustomButtonTextModalDemo() {
  const [visible, setVisible] = useState(false)
  
  return (
    <>
      <Button onClick={() => setVisible(true)}>
        自定义按钮文字
      </Button>
      <Modal
        title="自定义按钮文字"
        visible={visible}
        okText="确定提交"
        cancelText="返回"
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <p>你可以自定义对话框底部按钮的文字。</p>
      </Modal>
    </>
  )
}
```

## 确认对话框

使用 `Modal.confirm()` 可以快速创建一个确认对话框。

```jsx
import { Modal, Button } from 'Pntd'

export default function ConfirmModalDemo() {
  const showConfirm = () => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个项目吗？删除后不可恢复。',
      onOk() {
        console.log('确认删除')
      },
      onCancel() {
        console.log('取消删除')
      }
    })
  }
  
  return (
    <Button onClick={showConfirm}>删除</Button>
  )
}
```

## 信息提示

`Modal` 提供了一系列静态方法用于展示不同类型的信息提示对话框。

```jsx
import { Modal, Button, Space } from 'Pntd'

export default function ModalTypesDemo() {
  return (
    <Space>
      <Button onClick={() => Modal.info({ title: '信息', content: '这是一条普通信息' })}>
        信息
      </Button>
      <Button onClick={() => Modal.success({ title: '成功', content: '操作成功！' })}>
        成功
      </Button>
      <Button onClick={() => Modal.error({ title: '错误', content: '操作失败！' })}>
        错误
      </Button>
      <Button onClick={() => Modal.warning({ title: '警告', content: '确定要执行此操作吗？' })}>
        警告
      </Button>
    </Space>
  )
}
```

## 自定义位置

可以通过 `centered` 属性使对话框垂直居中显示。

```jsx
import { Modal, Button } from 'Pntd'
import { useState } from 'react'

export default function CenteredModalDemo() {
  const [visible, setVisible] = useState(false)
  
  return (
    <>
      <Button onClick={() => setVisible(true)}>
        垂直居中对话框
      </Button>
      <Modal
        title="垂直居中"
        visible={visible}
        centered
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <p>对话框垂直居中显示。</p>
      </Modal>
    </>
  )
}
```

## API

### Modal 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 对话框是否可见 | `boolean` | `false` |
| title | 标题 | `ReactNode` | - |
| closable | 是否显示右上角的关闭按钮 | `boolean` | `true` |
| onOk | 点击确定回调 | `(e: MouseEvent) => void` | - |
| onCancel | 点击遮罩层、右上角叉、取消按钮的回调 | `(e: MouseEvent) => void` | - |
| okText | 确认按钮文字 | `ReactNode` | `'确定'` |
| cancelText | 取消按钮文字 | `ReactNode` | `'取消'` |
| centered | 垂直居中展示 | `boolean` | `false` |
| width | 宽度 | `string \| number` | `520` |
| footer | 底部内容 | `ReactNode` | 默认的确定取消按钮 |
| okType | 确认按钮类型 | `'primary' \| 'default' \| 'danger'` | `'primary'` |
| maskClosable | 点击蒙层是否允许关闭 | `boolean` | `true` |
| mask | 是否显示遮罩 | `boolean` | `true` |
| className | 对话框类名 | `string` | - |
| style | 对话框样式 | `CSSProperties` | - |
| keyboard | 是否支持键盘 esc 关闭 | `boolean` | `true` |
| showCancel | 是否显示取消按钮 | `boolean` | `true` |

### Modal 方法

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| Modal.confirm | 确认对话框 | `(config: ModalFuncProps) => { destroy, update }` |
| Modal.info | 信息提示对话框 | `(config: ModalFuncProps) => { destroy, update }` |
| Modal.success | 成功提示对话框 | `(config: ModalFuncProps) => { destroy, update }` |
| Modal.error | 错误提示对话框 | `(config: ModalFuncProps) => { destroy, update }` |
| Modal.warning | 警告提示对话框 | `(config: ModalFuncProps) => { destroy, update }` |

### ModalFuncProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | `ReactNode` | - |
| content | 内容 | `ReactNode` | - |
| onOk | 点击确定回调 | `() => void` | - |
| onCancel | 点击取消回调 | `() => void` | - |
| okText | 确认按钮文字 | `ReactNode` | `'确定'` |
| cancelText | 取消按钮文字 | `ReactNode` | `'取消'` |
| centered | 垂直居中展示 | `boolean` | `false` |
| width | 宽度 | `string \| number` | `416` |
| okType | 确认按钮类型 | `'primary' \| 'default' \| 'danger'` | `'primary'` |
| icon | 图标 | `ReactNode` | - |
```