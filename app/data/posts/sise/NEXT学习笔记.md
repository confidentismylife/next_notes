# NEXT学习笔记

next13.4从page到app路由

**你可以发现：同一文件夹下如果有 layout.js 和 page.js，page 会作为 children 参数传入 layout。换句话说，layout 会包裹同层级的 page。**

也就是说 `layout` 会包裹 `template`，`template` 又会包裹 `page`。

某些情况下，模板会比布局更适合：

- 依赖于 useEffect 和 useState 的功能，比如记录页面访问数（维持状态就不会在路由切换时记录访问数了）、用户反馈表单（每次重新填写）等
- 更改框架的默认行为，举个例子，布局内的 Suspense 只会在布局加载的时候展示一次 fallback UI，当切换页面的时候不会展示。但是使用模板，fallback 会在每次路由切换的时候展示

layou会保持状态



路由

1. 使用 `<Link>` 组件
2. 使用 `useRouter` Hook（客户端组件）
3. 使用 `redirect` 函数（服务端组件）
4. 使用浏览器原生 History API

​	**const** router = **useRouter**()

​	**redirect**('/login')

## 1. 动态路由（Dynamic Routes）

```ts
// app/blog/[slug]/page.js
export default function Page({ params }) {
  return <div>My Post: {params.slug}</div>
}
```

### [...folderName]

###  [[...folderName]]

## 2. 路由组（Route groups）

（team）不影响布局，更多语义化

## 3. 平行路由（Parallel Routes）

作用插槽条件渲染

独立子路由

# 4.拦截路由

- `(.)` 表示匹配同一层级
- `(..)` 表示匹配上一层级
- `(..)(..)` 表示匹配上上层级。
- `(...)` 表示匹配根目录



# route方法

```ts
// route.js
export async function GET(request) {}
 
export async function HEAD(request) {}
 
export async function POST(request) {}
 
export async function PUT(request) {}
 
export async function DELETE(request) {}
 
export async function PATCH(request) {}
 
// 如果 `OPTIONS` 没有定义, Next.js 会自动实现 `OPTIONS`
export async function OPTIONS(request) {}
```

GET默认有缓存变为静态

退出缓存

```ts
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  return Response.json({ data: new Date().toLocaleTimeString(), params: searchParams.toString() })
}
```

- 添加其他 HTTP 方法，比如 POST
- 使用像 cookies、headers 这样的[动态函数](https://juejin.cn/book/7307859898316881957/section/7309076661532622885#heading-9)

```ts
export async function GET(request) {
  const token = request.cookies.get('token')
  return Response.json({ data: new Date().toLocaleTimeString() })
}

```

- [路由段配置项](https://juejin.cn/book/7307859898316881957/section/7309079033223446554#heading-3)手动声明为动态模式

```ts
export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json({ data: new Date().toLocaleTimeString() })
}
```

重新校验

```ts
export const revalidate = 10

export async function GET() {
  return Response.json({ data: new Date().toLocaleTimeString() })
}
```

fetch在next里面默认 有 缓存

```ts
export async function GET() {
  const res = await fetch('https://api.thecatapi.com/v1/images/search', {
    next: { revalidate: 5 }, //  每 5 秒重新验证
  })
  const data = await res.json()
  console.log(data)
  return Response.json(data)
}
```

### 如何获取请求体内容？



```ts
// app/items/route.js 
import { NextResponse } from 'next/server'
 
export async function POST(request) {
  const res = await request.json()
  return NextResponse.json({ res })
}

// app/items/route.js
import { NextResponse } from 'next/server'
 
export async function POST(request) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  return NextResponse.json({ name, email })
}
```

## 中间件

写中间件，你需要在项目的根目录定义一个名为 `middleware.js`的文件：类似axios拦截请求器，相应器

```ts
// middleware.js
import { NextResponse } from 'next/server'
 
// 中间件可以是 async 函数，如果使用了 await
export function middleware(request) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// 设置匹配路径
export const config = {
  matcher: '/about/:path*',
}
```

# 以下是Page路由里面的

# 渲染篇

**1.CSR，英文全称“Client-side Rendering”，中文翻译“客户端渲染”。顾名思义，渲染工作主要在客户端执行。**

使用react钩子，’use clinet‘

### 2.**SSR，英文全称“Server-side Rendering”，中文翻译“服务端渲染”。顾名思义，渲染工作主要在服务端执行。**

使用 SSR，你需要导出一个名为 `getServerSideProps`的 async 函数。这个函数会在每次请求的时候被调用。返回的数据会通过组件的 props 属性传递给组件。

### 3. **SSG，英文全称“Static Site Generation”，中文翻译“静态站点生成”。**

Next.js 支持 SSG。当不获取数据时，默认使用的就是 SSG。

`getStaticProps`会在构建的时候被调用，并将数据通过 props 属性传递给页面。

**4.ISR，英文全称“Incremental Static Regeneration”，中文翻译“增量静态再生”。**

Next.js 支持 ISR，并且使用的方式很简单。你只用在 `getStaticProps` 中添加一个 `revalidate`即可



# React Server Component 颠覆式更新

在服务端，React 会将其渲染会一个包含基础 HTML 标签和**客户端组件占位**的树。

因为客户端组件的数据和结构在客户端渲染的时候才知道，所以客户端组件此时在树中使用特殊的占位进行替代。

当然这个树不可能直接就发给客户端，React 会做序列化处理，客户端收到后会在客户端根据这个数据重构 React 树，然后用真正的客户端组件填充占位，渲染最终的结果。





但是 HTML 是没有交互性的（non-interactive UI），客户端渲染出 HTML 后，还要等待 JavaScript 完全下载并执行。JavaScript 会赋予 HTML 交互性，这个阶段被称为水合（Hydration）。此时内容变为可交互的（interactive UI）。



从这个过程中，我们可以看出 SSR 的几个缺点：

1. SSR 的数据获取必须在组件渲染之前
2. 组件的 JavaScript 必须先加载到客户端，才能开始水合
3. 所有组件必须先水合，然后才能跟其中任意一个组件交互

可以看出 SSR 这种技术“大开大合”，加载整个页面的数据，加载整个页面的 JavaScript，水合整个页面，还必须按此顺序串行执行。如果有某些部分慢了，都会导致整体效率降低。

此外，SSR 只用于页面的初始化加载，对于后续的交互、页面更新、数据更改，SSR 并无作用。



正如它们的名字所表明的那样，Server-side Rendering 的重点在于 **Rendering**，React Server Components 的重点在于 **Components**。

简单来说，RSC 提供了更细粒度的组件渲染方式，可以在组件中直接获取数据，而非像 Next.js v12 中的 SSR 顶层获取数据。RSC 在服务端进行渲染，组件依赖的代码不会打包到 bundle 中，而 SSR 需要将组件的所有依赖都打包到 bundle 中。

当然两者最大的区别是：

SSR 是在服务端将组件渲染成 HTML 发送给客户端，而 RSC 是将组件渲染成一种特殊的格式，我们称之为 RSC Payload。这个 RSC Payload 的渲染是在服务端，但不会一开始就返回给客户端，而是在客户端请求相关组件的时候才返回给客户端，RSC Payload 会包含组件渲染后的数据和样式，客户端收到 RSC Payload 后会重建 React 树，修改页面 DOM。

这也就带来了我们常说的 SSR 和 RSC 的最大区别，那就是**状态的保持**（渲染成不同的格式是“因”，状态的保持是“果”）。每次 SSR 都是一个新的 HTML 页面，所以状态不会保持（传统的做法是 SSR 初次渲染，然后 CSR 更新，这种情况，状态可以保持，不过现在讨论的是 SSR，对于两次 SSR，状态是无法维持的）。

但是 RSC 不同，RSC 会被渲染成一种特殊的格式（RSC Payload），可以多次重新获取，然后客户端根据这个特殊格式更新 UI，而不会丢失客户端状态。





在最近的两篇文章里，我们已经介绍了 SSR 的原理和缺陷。简单来说，使用 SSR，需要经过一系列的步骤，用户才能查看页面、与之交互。具体这些步骤是：

1. 服务端获取所有数据
2. 服务端渲染 HTML
3. 将页面的 HTML、CSS、JavaScript 发送到客户端
4. 使用 HTML 和 CSS 生成不可交互的用户界面（non-interactive UI）
5. React 对用户界面进行水合（hydrate），使其可交互（interactive UI）



使用 Suspense 还有一个好处就是 Selective Hydration（选择性水合）。简单的来说，当多个组件等待水合的时候，React 可以根据用户交互决定组件水合的优先级。比如 Sidebar 和 MainContent 组件都在等待水合，快要到 Sidebar 了，但此时用户点击了 MainContent 组件，React 会在单击事件的捕获阶段同步水合 MainContent 组件以保证立即响应，Sidebar 稍后水合。

总结一下，使用 Suspense，可以解锁两个主要的好处，使得 SSR 的功能更加强大：

1. Streaming Server Rendering（流式渲染）：从服务器到客户端渐进式渲染 HTML
2. Selective Hydration（选择性水合）：React 根据用户交互决定水合的优先级

### 缺点

Suspense 和 Streaming 确实很好，将原本只能先获取数据、再渲染水合的传统 SSR 改为渐进式渲染水合，但还有一些问题没有解决。就比如用户下载的 JavaScript 代码，该下载的代码还是没有少，可是用户真的需要下载那么多的 Javascript 代码吗？又比如所有的组件都必须在客户端进行水合，对于不需要交互性的组件其实没有必要进行水合。

为了解决这些问题，目前的最终方案就是上一篇介绍的 RSC：



# 在 Next.js 中，组件默认就是服务端组件。

你会发现 `init text`其实是来自于 useState 中的值，但是却依然输出在 HTML 中。这就是编译客户端组件的作用，为了第一次加载的时候能更快的展示出内容。

所以其实所谓服务端组件、客户端组件并不直接对应于物理上的服务器和客户端。服务端组件运行在构建时和服务端，客户端组件运行在构建时、服务端（生成初始 HTML）和客户端（管理 DOM）。



###  **服务端组件可以直接导入客户端组件，但客户端组件并不能导入服务端组件**

组件默认是服务端组件，但当组件导入到客户端组件中会被认为是客户端组件。客户端组件不能导入服务端组件，其实是在告诉你，如果你在服务端组件中使用了诸如 Node API 等，该组件可千万不要导入到客户端组件中。

但你可以将服务端组件以 props 的形式传给客户端组



当你在服务端组件中获取的数据，需要以 props 的形式向下传给客户端组件，这个数据需要做序列化。

这是因为 React 需要先在服务端将组件树先序列化传给客户端，再在客户端反序列化构建出组件树。如果你传递了不能序列化的数据，这就会导致错误。

如果你不能序列化，那就改为在客户端使用三方包获取数据吧。



静态渲染

动态渲染

#### 2.1. 使用动态函数（Dynamic functions）

**动态函数指的是获取只有在请求时才能得到信息（如 cookie、请求头、URL 参数）的函数**。

在 Next.js 中这些动态函数是：

- [cookies()](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-7) 和 [headers()](https://juejin.cn/book/7307859898316881957/section/7309079651500949530#heading-20) ：获取 cookie 和 header
- `searchParams`：页面查询参数（界面刷新不不一定请求不会被渲染）

使用这些函数的任意一个，都会导致路由转为动态渲染。

**fetch**('https://api.thecatapi.com/v1/images/search', { cache: 'no-store' })



但这些情况默认不会自动缓存：

1. 在 Server Action 中使用的时候
2. 在定义了非 GET 方法的路由处理程序中使用的时候

**简单的来说，在服务端组件和只有 GET 方法的路由处理程序中使用 fetch，返回结果会自动缓存**

###  Next.js 中有四种缓存机制：

| 机制                             | 缓存内容            | 存储地方 | 目的                      | 期间               |
| -------------------------------- | ------------------- | -------- | ------------------------- | :----------------- |
| 请求记忆（Request Memoization）  | 函数返回值          | 服务端   | 在 React 组件树中复用数据 | 每个请求的生命周期 |
| 数据缓存（Data Cache ）          | 数据                | 服务端   | 跨用户请求和部署复用数据  | 持久（可重新验证） |
| 完整路由缓存（Full Route Cache） | HTML 和 RSC payload | 服务端   | 降低渲染成本、提高性能    | 持久（可重新验证） |
| 路由缓存（Router Cache）         | RSC payload         | 客户端   | 减少导航时的服务端请求    | 用户会话或基于时间 |

Router Cache(客户端路由缓存)：客户端缓存机制，存放在浏览器的临时缓存中，用于在用户会话期间缓存已访问页面的 RSC Payload（如通过前进/后退导航快速加载）。在 Next.js 14 中，Router Cache 默认保留较长时间，可能导致旧数据展示（如通过 <Link> 跳转，Link 组件的 prefetch 默认为 true，或者在动态渲染路由中调用 router.prefetch，可以进入缓存 5 分钟。）。Next.js 15 中，客户端导航时优先请求最新数据，仅当数据未变化时复用缓存，减少过时内容问题（默认 staleTime 设为 0）。共享布局（Layout）的缓存仍保留，避免重复加载公共部分。

● Full Route Cache(整页路由缓存)：在 Next.js 14 及之前，静态生成的页面（如通过 getStaticProps）默认启用 Full Route Cache，HTML 和 RSC Payload 会被缓存以加速后续请求。Next.js 15 中，默认行为改为 no-store，即不再自动缓存，需显式配置 revalidate 参数或路由段设置（如 export const revalidate = 3600）来启用缓存
● Request Memoization（请求记忆）：用于在 React 组件树中复用相同请求的响应数据。Next.js 14 自动对所有 GET 方法的 fetch 请求启用请求记忆，包括布局、页面和其他服务端组件。Next.js 15仍支持请求记忆，但更严格限定于服务端组件（如 Layout、Page），且对动态路由和客户端组件的兼容性优化。

● Data Cache（数据缓存）：主要用于服务端数据的持久化存储，其核心目标是减少对后端数据源（如数据库、API）的重复请求。Next.js 14 自动缓存，需手动退出（fetch 请求和 GET 路由处理程序默认启用数据缓存）。Next.js 15 默认不缓存，需显式启用（fetch 请求默认使用 no-store）

# ServerAcTION

定义一个 Server Action 需要使用 React 的 ["use server"](https://link.juejin.cn/?target=https%3A%2F%2Freact.dev%2Freference%2Freact%2Fuse-server) 指令。按指令的定义位置分为两种用法：

1. 将 "use server" 放到一个 async 函数的顶部表示该函数为 Server Action（函数级别）
2. 将 "use server" 放到一个单独文件的顶部表示该文件导出的所有函数都是 Server Actions（模块级别）

**Server Actions 可以在服务端组件使用，也可以在客户端组件使用。**

```ts
'use server'

import { revalidatePath } from "next/cache";

const data = ['阅读', '写作', '冥想']
 
export async function findToDos() {
  return data
}

export async function createToDo(formData) {
  const todo = formData.get('todo')
  data.push(todo)
  revalidatePath("/form2");
  return data
}

```



### 注意要点

最后讲讲使用 Server Actions 的注意要点。

1. **Server Actions 的参数和返回值都必须是可序列化的**，简单的说，JSON.stringfiy 这个值不出错
2. Server Actions 会继承使用的页面或者布局的运行时和路由段配置项，包括像 maxDuration 等字段