export function formatPrice(value?: number | null, currency = "VND") {
  const amount = value ?? 0;

  if (amount <= 0) {
    return "Free";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
