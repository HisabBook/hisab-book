import { useState, useMemo } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
export const useInventoryFilters = (data, activeTab) => {
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

  // Debounce the filters to avoid re-calculating on every keystroke
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

  // Memoize the available brands based on the current dataset
  const availableBrands = useMemo(
    () => [...new Set(data.map((item) => item.brand).filter(Boolean))].sort(),
    [data]
  );

  // Memoize available categories only for accessories
  const availableCategories = useMemo(
    () =>
      activeTab === 'accessories'
        ? [...new Set(data.map((item) => item.category).filter(Boolean))].sort()
        : [],
    [data, activeTab]
  );

  // The core filtering logic, now neatly contained in this hook
  const filteredData = useMemo(() => {
    setIsFiltering(true);
    const lowercasedSearch = debouncedFilters.search.toLowerCase();

    const result = data.filter((item) => {
      // Search logic
      if (lowercasedSearch) {
        const searchableContent = [
          item.imei,
          item.serialNumber,
          item.model,
          item.name,
          item.brand,
          item.color,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!searchableContent.includes(lowercasedSearch)) return false;
      }

      // Filter logic
      if (debouncedFilters.brand && item.brand !== debouncedFilters.brand)
        return false;
      if (
        debouncedFilters.category &&
        item.category !== debouncedFilters.category
      )
        return false;
      if (
        debouncedFilters.status &&
        item.stockStatus !== debouncedFilters.status
      )
        return false;

      // Price logic
      const minPrice = parseFloat(debouncedFilters.minPrice);
      const maxPrice = parseFloat(debouncedFilters.maxPrice);
      if (!isNaN(minPrice) && item.sellPrice < minPrice) return false;
      if (!isNaN(maxPrice) && item.sellPrice > maxPrice) return false;

      // Date logic
      const itemDate = new Date(item.dateAdded);
      if (
        debouncedFilters.startDate &&
        itemDate < new Date(debouncedFilters.startDate)
      )
        return false;
      if (
        debouncedFilters.endDate &&
        itemDate > new Date(debouncedFilters.endDate)
      )
        return false;

      return true;
    });

    // Simulate filtering delay for UX
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
