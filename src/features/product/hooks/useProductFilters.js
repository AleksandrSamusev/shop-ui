import { useState } from "react";

const DEFAULT_FILTERS = {
  category: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "id,desc", // ✅ unified
};

export function useProductFilters() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(0);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
    setCurrentPage(0);
  };

  return {
    filters,
    searchQuery,
    currentPage,

    setCurrentPage,
    setSearchQuery,

    handleFilterChange,
    handleSearchChange,
    resetFilters,
  };
}