import handler from "@backend/utils/endpoints/handler";
import { ApiResponse, GenericHandler } from "@backend/types";
import { products } from "@backend/domains/products/products";
import { CreatePaymentBody } from "../types";
import { Product } from "@backend/domains/products/types";

type CreatePaymentResponse = {
  price: number;
};

const getProduct = ({
  quantity,
  billingPeriod,
}: CreatePaymentBody): Product => {
  if (billingPeriod === "monthly") {
    return products.monthly;
  }

  if (quantity > 1) {
    return products.teams;
  }

  return products.yearly;
};

const createPayment = ({
  body,
}: GenericHandler<CreatePaymentBody>): Promise<
  ApiResponse<CreatePaymentResponse>
> => {
  const { quantity, billingPeriod } = body;

  const product = getProduct({ quantity, billingPeriod });

  return Promise.resolve({
    statusCode: 201,
    body: {
      price: product.price * quantity,
    },
  });
};

export default handler<CreatePaymentBody, null, null>(createPayment);
