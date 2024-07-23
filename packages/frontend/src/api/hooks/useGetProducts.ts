import { useQuery } from "@tanstack/react-query";
import { API_URL } from "./config";

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/products`);
      return response.json();
    },
  });
};
