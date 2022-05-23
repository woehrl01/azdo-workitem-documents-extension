/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi } from 'vitest'
import { SettingsPage } from './SettingsPage'
import { flushPromises as allPendingPromisesCompleted, render, screen, userEvent, waitForElementToBeRemoved } from 'test/utils'
import * as SDK from 'azure-devops-extension-sdk'

vi.mock('azure-devops-extension-sdk')

describe('Settings page', () => {
    beforeEach(() => {
        (SDK as any).__resetMockedData()
    });

    it('the title is visible', async () => {
        render(<SettingsPage />)
        await allPendingPromisesCompleted()

        const heading = await screen.findByRole('heading')
        expect(heading).toBeInTheDocument()
        expect(heading.textContent).toBe('Embedded Documents')
    })

    it('Should add new row when clicking the button', async () => {
        render(<SettingsPage />)
        await allPendingPromisesCompleted();

        expect(screen.queryByPlaceholderText(/rule/i)).not.toBeInTheDocument();
        userEvent.click(screen.getByRole('menuitem', { name: /add rule/i }))
        await allPendingPromisesCompleted()
        expect(await screen.findByPlaceholderText(/rule/i)).toBeInTheDocument()
    })

    it('Should remove row on delete', async () => {

        (SDK as any).__setMockedData('rules', [{ rule: 'somerule', type: 'allow' }])

        render(<SettingsPage />)
        await allPendingPromisesCompleted();

        const someRule = await screen.findByDisplayValue(/somerule/i);
        expect(someRule).toBeInTheDocument()

        userEvent.click(screen.getByRole('button', { name: /more options/i }))
        await allPendingPromisesCompleted()

        userEvent.click(await screen.findByRole('menuitem', { name: /delete/i }))

        await waitForElementToBeRemoved(someRule);
    })

})
