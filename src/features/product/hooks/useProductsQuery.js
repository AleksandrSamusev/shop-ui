import { useEffect, useState } from "react";
import { productService } from "../services/productService";

export function useProductsQuery({ filters, search, page, size }) {
  const [data, setData] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0); // 👈 NEW

  const refetch = () => setRefreshKey((k) => k + 1); // 👈 NEW

  useEffect(() => {
    const fetchData = async () => {
      if (isInitialLoading) setIsInitialLoading(true);
      else setIsFetching(true);

      try {
        const res = await productService.getAllProducts({
          search,
          page,
          size,
          ...filters,
        });

        setData(res);
      } catch (err) {
        console.error("Failed to fetch products:", err.message);
      } finally {
        setIsInitialLoading(false);
        setIsFetching(false);
      }
    };

    fetchData();
  }, [filters, search, page, size, refreshKey]); // 👈 include refreshKey

  return {
    productsPage: data,
    isInitialLoading,
    isFetching,
    refetch, // 👈 expose it
  };
}