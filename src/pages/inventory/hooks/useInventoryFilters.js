import { useState, useMemo } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';

export const useInventoryFilters = (data) => {
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    category: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
  });

  const debouncedFilters = useDebounce(filters, 300);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      brand: '',
      category: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      startDate: '',
      endDate: '',
    });
  };

  const availableBrands = useMemo(
    () => [...new Set(data.map((item) => item.brand).filter(Boolean))].sort(),
    [data]
  );

  const availableCategories = useMemo(
    () => [...new Set(data.map((item) => item.category).filter(Boolean))].sort(),
    [data]
  );

  const filteredData = useMemo(() => {
    setIsFiltering(true);
    const lowercasedSearch = debouncedFilters.search.toLowerCase();

    const result = data.filter((item) => {
      if (lowercasedSearch) {
        const searchableContent = [
          item.id,
          item.itemType,
          item.displayName,
          item.brand,
          item.category,
          item.stockStatus,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchableContent.includes(lowercasedSearch)) return false;
      }

      if (debouncedFilters.brand && item.brand !== debouncedFilters.brand) return false;
      if (debouncedFilters.category && item.category !== debouncedFilters.category) return false;
      if (debouncedFilters.status && item.stockStatus !== debouncedFilters.status) return false;

      const minPrice = parseFloat(debouncedFilters.minPrice);
      const maxPrice = parseFloat(debouncedFilters.maxPrice);
      if (!Number.isNaN(minPrice) && item.sellPrice < minPrice) return false;
      if (!Number.isNaN(maxPrice) && item.sellPrice > maxPrice) return false;

      const itemDate = new Date(item.dateAdded);
      if (debouncedFilters.startDate && itemDate < new Date(debouncedFilters.startDate)) return false;
      if (debouncedFilters.endDate && itemDate > new Date(debouncedFilters.endDate)) return false;

      return true;
    });

    setTimeout(() => setIsFiltering(false), 200);
    return result;
  }, [data, debouncedFilters]);

  return {
    filters,
    handleFilterChange,
    handleClearFilters,
    filteredData,
    isFiltering,
    availableBrands,
    availableCategories,
  };
};
