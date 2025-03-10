import BackgroundImage from "./BackgroundImage"
import PenguinAnimation from "./PenguinAnimation"

interface Props {
	TypedTextComponent: React.ComponentType<{ initialText: string }>
	ScrollButtonComponent: React.ComponentType
}

export default function FirstScreenStatic({ TypedTextComponent, ScrollButtonComponent }: Props) {
	return (
		<div className="relative h-screen w-full">
			<BackgroundImage />
			<div className="relative z-10">
	
				<div className="text-7xl font-bold [text-shadow:_4px_4px_16px_rgb(255_255_255_/_90%),_6px_6px_20px_rgb(128_128_128_/_50%)]">
					<span className="flex flex-row items-center absolute top-[300px] right-[60px]">
						<span>NEXT</span>
						<span className="mx-6"></span>
						<span>NOTE</span>
					</span>
				</div>
				<div className="absolute top-[380px] right-28 text-black">
					<div className="mt-6 text-2xl [text-shadow:_2px_2px_12px_rgb(255_255_255_/_80%),_4px_4px_16px_rgb(128_128_128_/_40%)]">
						<TypedTextComponent initialText="欢迎来到我的博客🎉" />
					</div>
				</div>
				
				{/* 企鹅动画单独定位 */}
				<div className="absolute top-[480px] right-[140px]">
					<PenguinAnimation />
				</div>
				
				<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
					<ScrollButtonComponent />
				</div>
			</div>
		</div>
	)
}
