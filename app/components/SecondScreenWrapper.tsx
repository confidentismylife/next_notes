

import dynamic from 'next/dynamic'
import PreloadSecondScreen from './PreloadSecondScreen'

const SecondScreen = dynamic(() => import('./SecondScreen'), {
    ssr: false,
    loading: () => <div className="min-h-screen bg-[#f7f9fe]" />
})

export default function SecondScreenWrapper() {
    return (
        <PreloadSecondScreen onScroll={() => import('./SecondScreen')}>
            <SecondScreen />
        </PreloadSecondScreen>
    )
} 