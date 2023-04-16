export enum OrderStatus {
  open = 'Нове',
  pending = 'В обробці. Очікуйте на дзвінок від адміністратора',
  pendingnotcall = 'В обробці',
  paid = 'Оплачено',
  delivering = 'В дорозі',
  confirmed = 'Підтверджено',
  completed = 'Виконано',
  cancelled = 'Відмінено',
  reopened = 'Відкрито повторно',
}

export enum Status {
  OPEN = 'open',
  PENDING = 'pending',
  PENDINGNOTCALL = 'pendingnotcall',
  PAID = 'paid',
  DELIVERING = 'delivering',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REOPENED = 'reopened',
}

export enum DeliveryMethods {
  courier = 'Кур\'єрська доставка',
  selfPickup = 'Самовивіз'
}

export enum PaymentMethods {
  liqPay = 'LiqPay',
  postPay = 'Післяплата'
}