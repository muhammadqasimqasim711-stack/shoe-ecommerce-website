//#region node_modules/.nitro/vite/services/ssr/assets/staff-C5pUFFY_.js
var ORDER_STATUSES = [
	"Pending",
	"Confirmed",
	"Processing",
	"Packed",
	"Shipped",
	"Delivered",
	"Cancelled",
	"Returned",
	"Refunded"
];
var PRODUCT_STATUSES = [
	"DRAFT",
	"ACTIVE",
	"OUT_OF_STOCK",
	"ARCHIVED"
];
var RETURN_STATUSES = [
	"Requested",
	"Approved",
	"Rejected",
	"Item Received",
	"Refund Processing",
	"Refunded",
	"Closed"
];
var CUSTOMER_SEGMENTS = [
	{
		value: "new",
		label: "New"
	},
	{
		value: "returning",
		label: "Returning"
	},
	{
		value: "vip",
		label: "VIP"
	},
	{
		value: "high_spending",
		label: "High spending"
	},
	{
		value: "inactive",
		label: "Inactive"
	}
];
function formatMoney(amount, currency = "USD") {
	try {
		return new Intl.NumberFormat(void 0, {
			style: "currency",
			currency
		}).format(amount);
	} catch {
		return `$${amount.toFixed(2)}`;
	}
}
function formatDate(dateInput, fallback = "—") {
	if (!dateInput) return fallback;
	const d = new Date(dateInput);
	if (isNaN(d.getTime())) return fallback;
	return d.toLocaleDateString();
}
function formatDateTime(dateInput, fallback = "—") {
	if (!dateInput) return fallback;
	const d = new Date(dateInput);
	if (isNaN(d.getTime())) return fallback;
	return d.toLocaleString();
}
//#endregion
export { formatDate as a, RETURN_STATUSES as i, ORDER_STATUSES as n, formatDateTime as o, PRODUCT_STATUSES as r, formatMoney as s, CUSTOMER_SEGMENTS as t };
