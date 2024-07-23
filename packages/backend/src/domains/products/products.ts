import { BillingPeriod } from "../payments/types";

export const products = {
  monthly: {
    id: "monthly",
    price: 10,
    billingPeriod: BillingPeriod.Monthly,
  },
  yearly: {
    id: "yearly",
    price: 100,
    billingPeriod: BillingPeriod.Annually,
  },
  teams: {
    id: "teams",
    price: 90,
    billingPeriod: BillingPeriod.Annually,
  },
};
