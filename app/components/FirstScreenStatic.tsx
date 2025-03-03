import BackgroundImage from './BackgroundImage'

interface Props {
  TypedTextComponent: React.ComponentType<{ initialText: string }>
  ScrollButtonComponent: React.ComponentType
}

export default function FirstScreenStatic({ 
  TypedTextComponent,
  ScrollButtonComponent 
}: Props) {
  return (
    <div className="relative h-screen w-full">
      <BackgroundImage />
      <div className="relative z-10">
        <div className="flex-1 absolute top-32 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl font-bold [text-shadow:_2px_2px_10px_rgb(0_0_0_/_70%)]">
          <span className="flex items-center gap-8">
            <span>NEXT</span>
            <span>NOTE</span>
          </span>
        </div>
        <div className="absolute top-44 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl [text-shadow:_1px_1px_8px_rgb(0_0_0_/_60%)]">
          <TypedTextComponent initialText="欢迎来到我的博客🎉" />
        </div>
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <ScrollButtonComponent />
        </div>
      </div>
    </div>
  )
} 