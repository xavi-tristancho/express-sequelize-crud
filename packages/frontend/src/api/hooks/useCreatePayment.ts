import { useMutation } from "@tanstack/react-query";
import { API_URL } from "./config";
import { CreatePaymentBody } from "@backend/domains/payments/types";

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: async ({ quantity, billingPeriod }: CreatePaymentBody) => {
      const response = await fetch(`${API_URL}/payments`, {
        method: "POST",
        body: JSON.stringify({ quantity, billingPeriod }),
        headers: myHeaders,
      });

      return response.json();
    },
  });
};
