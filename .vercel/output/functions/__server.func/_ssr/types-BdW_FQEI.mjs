//#region node_modules/.nitro/vite/services/ssr/assets/types-BdW_FQEI.js
var STAFF_ROLES = [
	"SUPER_ADMIN",
	"ADMIN",
	"PRODUCT_MANAGER",
	"ORDER_MANAGER",
	"CUSTOMER_SUPPORT",
	"MARKETING_MANAGER"
];
function isStaffRole(role) {
	return !!role && STAFF_ROLES.includes(role);
}
//#endregion
export { isStaffRole as n, STAFF_ROLES as t };
