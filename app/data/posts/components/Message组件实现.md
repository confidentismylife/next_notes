# Message组件实现

1.传参

```typescript
props {
	id
    type 
    context
    delay
}
```

2.Mesaage 组件容器,绑定在window对象全局可以调用，

```typescript
const messagecontext=creatContext(null)
(props)=>{
	const [message,setMessage]=useState()
	addMessage((message)=>{
	(pre)=>{
		const newMessage=[...pre]
		if(newMessage>=maxcont){
				newMessage.shift()
		}
		return [...newMessage,{id:new Date.now(), }]
	}}
	)
	remove((id)=>setMesagge(pre)=>pre.filter(item=>item.id==id))'
	return (
		<messageContext.Provide value={{add,message}}>
	)
}
useEffect(()=>{
	window.__mesagge({
	add,
	remove
})
})
```

3.massage对象暴露出去预设调用

```typescript
const message={
	success:(context,delay)=>{
		createRoot()
		cosnt context=window.__massage
		context.add('success',context,delay)
	}
	info
	danger
	warn
	
}
```

4.messgeitem超时清除

```typescript
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration * 1000);
      return () => clearTimeout(timer);
    }
```

