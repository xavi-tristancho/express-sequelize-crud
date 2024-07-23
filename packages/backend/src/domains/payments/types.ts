export enum BillingPeriod {
  Monthly = "monthly",
  Annually = "annually",
}

export type CreatePaymentBody = {
  quantity: number;
  billingPeriod: BillingPeriod;
};
