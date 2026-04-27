import { expect, test as base } from '@playwright/test'
import { createConfiguratorActions } from './actions/configuratorActions'
import { createCheckOutActions } from './actions/checkOutActions'
import { createOrderLockupActions } from './actions/orderLockupActions'

type App = {
  configurator: ReturnType<typeof createConfiguratorActions>
  checkOut: ReturnType<typeof createCheckOutActions>
  orderLockup: ReturnType<typeof createOrderLockupActions>
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      configurator: createConfiguratorActions(page),
      checkOut: createCheckOutActions(page),
      orderLockup: createOrderLockupActions(page),
    }
    await use(app)
  },
})

export { expect }
