import dynamic from "next/dynamic"
import Image from "next/image"

// 客户端交互逻辑组件
const ScrollInteraction = dynamic(() => import("./ScrollInteraction"), {
	ssr: false,
})

export default function ScrollButton() {
	return (
		<ScrollInteraction>
			<button className="hover:scale-110 transition-transform duration-200">
				<Image src="/huojian.png" alt="滚动" width={40} height={40} className="animate-bounce" />
			</button>
		</ScrollInteraction>
	)
}
