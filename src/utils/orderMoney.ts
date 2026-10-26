/** Order amounts: prefer real_price (yuan float). pay_price is rounded yuan, not fen. */
export type OrderPrice = {
  real_price?: number;
  pay_price?: number;
};

export function orderYuan(price?: OrderPrice | null): number {
  if (!price) return 0;
  const real = Number(price.real_price);
  if (Number.isFinite(real) && real > 0) return real;
  const pay = Number(price.pay_price);
  return Number.isFinite(pay) ? pay : 0;
}

export function formatOrderYuan(price?: OrderPrice | null): string {
  return `¥${orderYuan(price).toFixed(2)}`;
}
