// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSWR } from './4-use-swr-1.ts'

const fetcher = () => ({ name: 'BFE.dev' })

describe('useSWR', () => {
    it('fetcher could be a non-Promise', async () => {
        let renderCount = 0

        const { result } = renderHook(() => {
            renderCount += 1
            return useSWR('/api', fetcher)
        })

        // initial render (hook runs once)
        const { data, error } = result.current

        expect(error).toBeUndefined()
        expect(data).toEqual({ name: 'BFE.dev' })
        expect(renderCount).toBe(1)
    })
})