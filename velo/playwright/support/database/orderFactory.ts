import type { Kysely } from 'kysely'
import type { Database, OrderStatus, OrderColor, WheelType, PaymentMethod } from './schema'
import type { OrderData } from '../actions/orderLockupActions'
import { generateOrderCode } from '../helpers'

const COLOR_LABELS: Record<OrderColor, string> = {
  'glacier-blue': 'Glacier Blue',
  'lunar-white': 'Lunar White',
  'midnight-black': 'Midnight Black',
}

const WHEEL_LABELS: Record<WheelType, string> = {
  aero: 'aero Wheels',
  sport: 'sport Wheels',
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  avista: 'À Vista',
  financiamento: 'Financiamento 12x',
}

interface OrderOverrides {
  order_number?: string
  color?: OrderColor
  wheel_type?: WheelType
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  customer_cpf?: string
  payment_method?: PaymentMethod
  total_price?: string
}

export async function createTestOrder(
  db: Kysely<Database>,
  status: OrderStatus,
  overrides: OrderOverrides = {}
): Promise<OrderData> {
  const order_number: string = overrides.order_number ?? generateOrderCode()
  const color: OrderColor = overrides.color ?? 'glacier-blue'
  const wheel_type: WheelType = overrides.wheel_type ?? 'aero'
  const payment_method: PaymentMethod = overrides.payment_method ?? 'avista'

  const order = {
    id: crypto.randomUUID(),
    order_number,
    color,
    wheel_type,
    customer_name: overrides.customer_name ?? 'Teste Playwright',
    customer_email: overrides.customer_email ?? 'playwright@velo.dev',
    customer_phone: overrides.customer_phone ?? '(11) 99999-9999',
    customer_cpf: overrides.customer_cpf ?? '000.000.000-00',
    payment_method,
    total_price: overrides.total_price ?? '40000',
    status,
    optionals: [] as string[],
  }

  await db.insertInto('orders').values(order).execute()

  return {
    number: order.order_number,
    status,
    color: COLOR_LABELS[color],
    wheels: WHEEL_LABELS[wheel_type],
    customer: {
      name: order.customer_name,
      email: order.customer_email,
    },
    payment: PAYMENT_LABELS[payment_method],
  }
}

export async function deleteTestOrder(
  db: Kysely<Database>,
  orderNumber: string
): Promise<void> {
  await db.deleteFrom('orders').where('order_number', '=', orderNumber).execute()
}
