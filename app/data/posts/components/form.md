# 表单 Form

表单是数据录入的主要载体，用于数据收集、校验和提交。

## 基本用法

基础的表单数据域控制展示，包含布局、初始化、校验等功能。

```jsx
import { Form, Input, Button } from 'Pntd'

export default function BasicFormDemo() {
  const onFinish = (values) => {
    console.log('表单提交成功:', values)
  }

  const onFinishFailed = (errors, values) => {
    console.log('表单提交失败:', errors, values)
  }

  return (
    <Form 
      initialValues={{ username: '', password: '' }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item 
        name="username" 
        label="用户名"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item 
        name="password" 
        label="密码"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input type="password" placeholder="请输入密码" />
      </Form.Item>
      <Button type="primary" htmlType="submit">提交</Button>
    </Form>
  )
}
```

## 不同布局

表单有三种布局：水平布局、垂直布局、行内布局。

```jsx
import { Form, Input, Button, Radio } from 'Pntd'
import { useState } from 'react'

export default function FormLayoutDemo() {
  const [layout, setLayout] = useState('horizontal')
  
  return (
    <>
      <Radio.Group 
        value={layout} 
        onChange={(e) => setLayout(e.target.value)}
      >
        <Radio value="horizontal">水平布局</Radio>
        <Radio value="vertical">垂直布局</Radio>
        <Radio value="inline">行内布局</Radio>
      </Radio.Group>
      
      <Form layout={layout} style={{ marginTop: 16 }}>
        <Form.Item label="用户名" name="username">
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item label="密码" name="password">
          <Input type="password" placeholder="请输入密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary">提交</Button>
        </Form.Item>
      </Form>
    </>
  )
}
```

## 表单校验

表单支持必填、类型、格式等多种校验规则，支持自定义校验逻辑。

```jsx
import { Form, Input, Button } from 'Pntd'

export default function FormValidationDemo() {
  return (
    <Form>
      <Form.Item 
        name="email" 
        label="邮箱" 
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱格式' }
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      
      <Form.Item 
        name="username" 
        label="用户名" 
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 3, max: 15, message: '用户名长度需在3-15个字符之间' }
        ]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      
      <Form.Item 
        name="password" 
        label="密码" 
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码长度不能小于6位' }
        ]}
      >
        <Input type="password" placeholder="请输入密码" />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
  )
}
```

## API

### Form

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 表单名称 | `string` | `'表单'` |
| layout | 表单布局 | `'horizontal' \| 'vertical' \| 'inline'` | `'horizontal'` |
| initialValues | 表单初始值 | `object` | - |
| onFinish | 提交表单且数据验证成功后回调事件 | `(values: object) => void` | - |
| onFinishFailed | 提交表单且数据验证失败后回调事件 | `(errors: object, values: object) => void` | - |
| className | 自定义类名 | `string` | - |

### Form.Item

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 字段名 | `string` | - |
| label | 标签文本 | `ReactNode` | - |
| rules | 校验规则，设置字段的校验规则 | `Rule[]` | - |
| valuePropName | 子节点值的属性，如 Switch 的是 'checked' | `string` | `'value'` |
| initialValue | 设置子元素默认值 | `any` | - |
| className | 自定义类名 | `string` | - |

### FormInstance 方法

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| submitForm | 提交表单 | - |
| validateField | 验证指定字段 | `(name: string) => void` |
| resetFields | 重置所有字段 | - | 