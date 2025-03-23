# Form 表单的实现

1. 传参

   ```
   props {
   	name
   	classname
   	inintValue
   	onSunbmit
   	onFaild
   	children
   	layout
   }
   
   ```

2. 设计

   ```
   <Form name={name} inintVlaue={initValue}>
       <FormItem name={usename} onChange={onChange}>
           <input>
       </FormItem>
   <Form>
   ```

   

initntVlua的值要传入input，name，onChange也要

如果有很多的子组件使用creatContext传

借助useStore统一管理form的值的状态

```
	const [form, setForm] = useState<FormState>({ isValid: true })
	const [fields, dispatch] = useReducer(feildReducer,{})
```

一个form，一个对form进行操作的reduce

```
fields props {
	name
	value
	isVaild
	label
	error
	rules[]
}
```

Form向外暴露个方法

```
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        submitForm()
    }
    
    // 提交表单方法
    const submitForm = () => {
        // 构建表单值对象
        const values: Record<string, any> = {}
        Object.keys(fields).forEach(name => {
            values[name] = fields[name].value
        })
        
        // 验证表单
        validateForm((isValid, errors) => {
            if (isValid) {
                onFinish && onFinish(values)
            } else {
                onFinishFailed && onFinishFailed(errors, values)
            }
        })
    }
    
    // 重置表单
    const resetFields = () => {
        Object.keys(fields).forEach(name => {
            dispatch({
                type: 'update',
                name,
                value: initialValues?.[name] || ''
            })
        })
    }
    
    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
        submitForm,
        validateField: (name: string) => {
            const field = fields[name];
            if (field && field.rules) {
                validateField(name, field.value, field.rules);
            }
        },
        resetFields
    }));
```

```
<Formitem name='checkd' propName='checkd' trigger='onChange'  getValueFromEvent={()=>viod}
>
	<Check>
</Formitem>
```

4个属性配合React.clone传参数各种情况给child

dispatch 更新数据

```

function feildReducer(state: FieldState, action: FieldsAction): FieldState {
	switch (action.type) {
		case "add":
			return {
				...state,
				[action.name]: { ...action.value },
			}
		case "update":
			return {
                ...state,
                [action.name]:{...state[action.name],value:action.value}
            }
		case "validate":
			return {
				...state,
				[action.name]: {
					...state[action.name],
					isValid: !action.error,
					error: action.error || ''
				}
			}
		case 'updateValidateResult': {
			const { isValid, errors, preserveValue } = action.value;
			
			// 创建新的字段状态，保留原始值
			const updatedField = {
				...state[action.name],
				isValid,
				errors
			};
			
			// 当字段值不应被保留时，返回完整更新
			return {
				...state,
				[action.name]: updatedField
			};
		}
		default:
			return state
	}
}
```

