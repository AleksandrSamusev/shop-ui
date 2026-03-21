import { useEffect, useState } from "react";
import { productService } from "../services/productService";

export function useProductStats() {
  const [stats, setStats] = useState({
    totalSkus: 0,
    stockValue: 0,
    lowStock: 0,
    topItem: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await productService.getInventoryStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [refreshKey]); // 👈 important

  return { stats, isLoading, refetch };
}