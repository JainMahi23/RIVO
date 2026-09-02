// Shared formatting helpers (currency, dates, percentages) so every
// module displays numbers the same way instead of ad-hoc toFixed() calls.
export function formatINR(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
