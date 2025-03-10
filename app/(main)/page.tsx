import dynamic from "next/dynamic"
import FirstScreenStatic from "../components/FirstScreenStatic"

// 动态导入交互组件
const ClientWrapper = dynamic(() => import("../components/ClientWrapper"), {
	ssr: false,
	loading: () => <FirstScreenStatic TypedTextComponent={() => <span>欢迎来到我的博客🎉</span>} ScrollButtonComponent={() => null} />,
})

export default function Home() {
	return <ClientWrapper />
}
