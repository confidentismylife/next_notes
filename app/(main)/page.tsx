'use client'

import { createDynamicComponent } from '../utils/dynamicImport'
import FirstScreenStatic from '../components/FirstScreenStatic'
import PreloadSecondScreen from '../components/PreloadSecondScreen'

// 动态导入交互组件
const TypedText = createDynamicComponent(() => import('../components/TypedText'), { 
	ssr: false,
	loading: () => <span>欢迎来到我的博客🎉</span>
})

const ScrollButton = createDynamicComponent(() => import('../components/ScrollButton'), {
	ssr: false,
	loading: () => null
})

// 第二屏延迟加载
const SecondScreen = createDynamicComponent(() => import('../components/SecondScreen'), {
	ssr: false,
	loading: () => <div className="min-h-screen bg-[#f7f9fe]" />
})

export default function Home() {
	return (
		<PreloadSecondScreen onScroll={() => import('../components/SecondScreen')}>
			<div className="w-full">
				<FirstScreenStatic 
					TypedTextComponent={TypedText}
					ScrollButtonComponent={ScrollButton}
				/>
				<SecondScreen />
			</div>
		</PreloadSecondScreen>
	)
}
