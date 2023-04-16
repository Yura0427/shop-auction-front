import { OrderStatus } from 'enums/order';

export const formatOrderStatus = (status: string) =>
  OrderStatus[status as keyof typeof OrderStatus];
