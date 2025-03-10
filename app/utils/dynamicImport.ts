import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

type DynamicOptions = {
    ssr?: boolean
    loading?: () => JSX.Element | null
}

export function createDynamicComponent<T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    { ssr, loading }: DynamicOptions = {}
) {
    const DynamicComponent = dynamic(importFn, {
        ssr,
        loading,
    }) as T & {
        preload: () => Promise<void>
    }
    return DynamicComponent
} 