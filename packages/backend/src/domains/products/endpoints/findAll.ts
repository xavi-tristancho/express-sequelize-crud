import handler from "@backend/utils/endpoints/handler";
import { ApiResponse } from "@backend/types";
import { ProductsResponse } from "@backend/domains/products/types";
import { products } from "../products";

const findAllProducts = (): Promise<ApiResponse<ProductsResponse>> => {
  return Promise.resolve({
    statusCode: 200,
    body: products,
  });
};

export default handler(findAllProducts);
