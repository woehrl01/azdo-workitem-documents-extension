import { cleanup, render } from '@testing-library/react'
import { afterEach } from 'vitest'
import userEventInternal from '@testing-library/user-event'


afterEach(() => {
    cleanup()
})

const customRender = (ui: React.ReactElement, options = {}) =>
    render(ui, {
        // wrap provider(s) here if needed
        wrapper: ({ children }) => children,
        ...options,
    })

const flushPromises = async (): Promise<void> => await new Promise(process.nextTick);

/* see: https://github.com/testing-library/user-event/issues/833 */
const userEvent = userEventInternal.setup({ delay: null });

export * from '@testing-library/react'

export { customRender as render, flushPromises, userEvent }
