# Message 全局提示

全局展示操作反馈信息。

## 何时使用

- 可提供成功、警告和错误等反馈信息。
- 顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式。

## 基本用法

:::demo
```tsx
import React from 'react';
import { Button, Message } from 'Pntd';

export default () => {
  const showMessage = () => {
    Message.info('这是一条普通提示信息');
  };

  return (
    <Button type="primary" onClick={showMessage}>
      显示提示
    </Button>
  );
};
```
:::

## 不同类型的提示

:::demo
```tsx
import React from 'react';
import { Button, Space, Message } from 'Pntd';

export default () => {
  return (
    <Space direction="vertical">
      <Button onClick={() => Message.success('操作成功')}>
        成功提示
      </Button>
      <Button onClick={() => Message.error('操作失败')}>
        错误提示
      </Button>
      <Button onClick={() => Message.warning('警告信息')}>
        警告提示
      </Button>
      <Button onClick={() => Message.loading('加载中...')}>
        加载提示
      </Button>
    </Space>
  );
};
```
:::

## 自定义显示时长

:::demo
```tsx
import React from 'react';
import { Button, Message } from 'Pntd';

export default () => {
  return (
    <Button onClick={() => Message.info('这条消息会显示10秒钟', 10)}>
      显示10秒
    </Button>
  );
};
```
:::

## 使用 hooks 方式创建

:::demo
```tsx
import React from 'react';
import { Button, Message } from 'Pntd';

export default () => {
  const { messageApi, contextHolder } = Message.useMessage();

  const showMessage = () => {
    messageApi.info('这是通过 useMessage 创建的消息');
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={showMessage}>
        显示提示
      </Button>
    </>
  );
};
```
:::

## API

### Message 配置项

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| duration | 默认自动关闭延时，单位秒 | number | 3 |
| getContainer | 配置渲染节点的输出位置 | () => HTMLElement | () => document.body |
| maxCount | 最大显示数量 | number | - |

### Message 方法

- `Message.success(content, [duration], [onClose])`
- `Message.error(content, [duration], [onClose])`
- `Message.info(content, [duration], [onClose])`
- `Message.warning(content, [duration], [onClose])`
- `Message.loading(content, [duration], [onClose])`

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容 | ReactNode | - |
| duration | 自动关闭的延时，单位秒 | number | 3 |
| onClose | 关闭时触发的回调函数 | () => void | - |

### Message.useMessage()

```typescript
const { messageApi, contextHolder } = Message.useMessage();
```

通过 `messageApi` 可以调用以下方法：

- `messageApi.success(content, [duration], [onClose])`
- `messageApi.error(content, [duration], [onClose])`
- `messageApi.info(content, [duration], [onClose])`
- `messageApi.warning(content, [duration], [onClose])`
- `messageApi.loading(content, [duration], [onClose])`
- `messageApi.open(config)`

`config` 对象属性：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容 | ReactNode | - |
| duration | 自动关闭的延时，单位秒 | number | 3 |
| type | 提示类型，可选 `success`, `info`, `warning`, `error`, `loading` | string | `info` |
| onClose | 关闭时触发的回调函数 | () => void | - |
| className | 自定义 CSS class | string | - |
| style | 自定义内联样式 | CSSProperties | - |
| onClick | 点击 message 时触发的回调函数 | (e: React.MouseEvent) => void | - |
| key | 当前提示的唯一标志 | string \| number | - |
``` 