import { describe, expect, it, vi } from 'vitest'
import { SettingsPage } from './SettingsPage'
import { flushPromises, render, screen, userEvent } from 'test/utils'

vi.mock('azure-devops-extension-sdk')

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
