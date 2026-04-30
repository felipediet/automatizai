import type { ColumnType } from 'kysely'

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'
export type OrderColor = 'glacier-blue' | 'lunar-white' | 'midnight-black'
export type WheelType = 'aero' | 'sport'
export type PaymentMethod = 'avista' | 'financiamento'

export interface OrdersTable {
  id: ColumnType<string, string | undefined, never>
  order_number: string
  color: OrderColor
  wheel_type: WheelType
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_cpf: string
  payment_method: PaymentMethod
  total_price: string
  status: OrderStatus
  created_at: ColumnType<string, string | undefined, never>
  updated_at: ColumnType<string, string | undefined, never>
  optionals: ColumnType<string[], string[] | undefined, never>
}

export interface Database {
  orders: OrdersTable
}
