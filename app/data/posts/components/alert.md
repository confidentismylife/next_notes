# Alert 警告提示

警告提示组件，用于页面中展示重要的提示信息。

## 基本用法

:::demo
```tsx
import React from 'react';
import { Alert } from 'Pntd';

export default () => (
  <div>
    <Alert message="提示信息" type="info" />
    <br />
    <Alert message="成功信息" type="success" />
    <br />
    <Alert message="警告信息" type="warning" />
    <br />
    <Alert message="错误信息" type="error" />
  </div>
);
```
:::

## 带有描述信息

:::demo
```tsx
import React from 'react';
import { Alert } from 'Pntd';

export default () => (
  <Alert
    message="带有描述的警告提示"
    description="这是一段描述文字，用于补充说明警告提示的内容。"
    type="info"
  />
);
```
:::

## 可关闭的警告提示

:::demo
```tsx
import React from 'react';
import { Alert } from 'Pntd';

export default () => (
  <Alert
    message="可关闭的警告提示"
    type="warning"
    closable
    onClose={() => console.log('警告已关闭')}
  />
);
```
:::

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| afterClose | 关闭动画结束后触发的回调函数 | () => void | - |
| closable | 是否显示关闭按钮 | boolean | false |
| description | 警告提示的辅助性文字介绍 | ReactNode | - |
| message | 警告提示内容 | ReactNode | - |
| type | 指定警告提示的样式，有四种选择：`success`、`info`、`warning`、`error` | string | `info` |
| onClose | 关闭时触发的回调函数 | (e: MouseEvent) => void | - |
| className | 自定义类名 | string | - |
| style | 自定义样式 | CSSProperties | - | 