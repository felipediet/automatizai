import { expect, test as base } from '@playwright/test'
import { createConfiguratorActions } from './actions/configuratorActions'
import { createOrderActions } from './actions/orderActions'
import { createOrderLockupActions } from './actions/orderLockupActions'

type App = {
  configurator: ReturnType<typeof createConfiguratorActions>
  order: ReturnType<typeof createOrderActions>
  orderLockup: ReturnType<typeof createOrderLockupActions>
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      configurator: createConfiguratorActions(page),
      order: createOrderActions(page),
      orderLockup: createOrderLockupActions(page),
    }
    await use(app)
  },
})

export { expect }
