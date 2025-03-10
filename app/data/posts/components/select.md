# Select 选择器

下拉选择器。当选项过多时，使用下拉菜单展示并选择内容。

## 基本用法

:::demo
```tsx
import React from 'react';
import { Select } from 'Pntd';

export default () => (
  <Select
    placeholder="请选择"
    options={[
      { value: '1', label: '选项1' },
      { value: '2', label: '选项2' },
      { value: '3', label: '选项3' },
    ]}
  />
);
```
:::

## 默认值

:::demo
```tsx
import React from 'react';
import { Select } from 'Pntd';

export default () => (
  <Select
    defaultValue="2"
    options={[
      { value: '1', label: '选项1' },
      { value: '2', label: '选项2' },
      { value: '3', label: '选项3' },
    ]}
  />
);
```
:::

## 禁用状态

:::demo
```tsx
import React from 'react';
import { Select } from 'Pntd';

export default () => (
  <Select
    disabled
    placeholder="禁用状态"
    options={[
      { value: '1', label: '选项1' },
      { value: '2', label: '选项2' },
      { value: '3', label: '选项3' },
    ]}
  />
);
```
:::

## 禁用选项

:::demo
```tsx
import React from 'react';
import { Select } from 'Pntd';

export default () => (
  <Select
    placeholder="包含禁用选项"
    options={[
      { value: '1', label: '选项1' },
      { value: '2', label: '选项2', disabled: true },
      { value: '3', label: '选项3' },
    ]}
  />
);
```
:::

## 受控组件

:::demo
```tsx
import React, { useState } from 'react';
import { Select } from 'Pntd';

export default () => {
  const [value, setValue] = useState('1');
  
  const handleChange = (newValue) => {
    console.log('选中值:', newValue);
    setValue(newValue);
  };
  
  return (
    <div>
      <p>当前选中: {value}</p>
      <Select
        value={value}
        onChange={handleChange}
        options={[
          { value: '1', label: '选项1' },
          { value: '2', label: '选项2' },
          { value: '3', label: '选项3' },
        ]}
      />
    </div>
  );
};
```
:::

## API

### Select 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultValue | 指定默认选中的条目 | string \| number | - |
| disabled | 是否禁用 | boolean | false |
| className | 自定义类名 | string | - |
| style | 自定义样式 | CSSProperties | - |
| onChange | 选中 option 时触发的回调函数 | (value: string \| number) => void | - |
| options | 可选项数据源 | { value: string \| number; label: ReactNode; disabled?: boolean }[] | - |
| placeholder | 选择框默认文字 | string | '请选择' |
| value | 指定当前选中的条目 | string \| number | - |

### SelectOption 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选项值 | string \| number | - |
| label | 选项显示内容 | ReactNode | - |
| disabled | 是否禁用该选项 | boolean | false | 