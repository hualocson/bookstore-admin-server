const CategoryStatus = {
  ACTIVE: 1001,
  INACTIVE: 1002,
};
const OrderStatus = {
  PENDING: 1301,
  PROCESSED: 1302,
  DELIVERED: 1303,
  CANCELED: 1304,
};
const ProductStatus = {
  IN_STOCK: 1101,
  OUT_OF_STOCK: 1102,
  ON_SALE: 1103,
  NEW_ARRIVAL: 1104,
  BEST_SELLER: 1105,
};
const CouponStatus = {
  ACTIVE: 1203,
  EXPIRED: 1204,
  DISABLES: 1205,
};
const CouponType = {
  PERCENT: 1201,
  FIXED_AMOUNT: 1202,
};

const CustomerStatus = {
  PENDING: 1401,
  ACTIVE: 1402,
  INACTIVE: 1403,
}

export { CategoryStatus, OrderStatus, ProductStatus, CouponStatus, CouponType, CustomerStatus };
