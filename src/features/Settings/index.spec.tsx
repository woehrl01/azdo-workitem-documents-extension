import { describe, expect, it, vi } from 'vitest'
import { SettingsPage } from './SettingsPage'
import { flushPromises, render, screen, userEvent } from 'test/utils'
import { CommonServiceIds } from 'components/Common'
import { IStoredRule } from 'services/Rules'

vi.mock('azure-devops-extension-sdk', () => {
    return {
        getAccessToken: vi.fn(() => Promise.resolve('token')),
        getService: vi.fn((serviceId: string) => {
            switch (serviceId) {
                case CommonServiceIds.ExtensionDataService:
                    return {
                        getExtensionDataManager: vi.fn(() => Promise.resolve(
                            {
                                setValue: vi.fn(() => Promise.resolve()),
                                getValue: vi.fn(() => {
                                    return Promise.resolve(new Array<IStoredRule[]>())
                                })
                            })
                        )
                    }
                default:
                    throw new Error('Unknown service id for mock:' + serviceId)
            }
        }),
        register: vi.fn(),
        getContributionId: vi.fn(),
        init: vi.fn(),
    }
})

describe('Simple working test', () => {
    it('the title is visible', async () => {
        render(<SettingsPage />)
        await flushPromises();
        const heading = await screen.findByRole('heading')
        expect(heading).toBeInTheDocument()
        expect(heading.textContent).toBe('Embedded Documents')
    })

    it('Should add new row when clicking the button', async () => {
        render(<SettingsPage />)
        await flushPromises();

        expect(await screen.queryAllByPlaceholderText(/rule/i)).toHaveLength(0)

        userEvent.click(screen.getByRole('menuitem', { name: /add rule/i }))

        await flushPromises();

        expect(await screen.queryAllByPlaceholderText(/rule/i)).toHaveLength(1)
    })
})
