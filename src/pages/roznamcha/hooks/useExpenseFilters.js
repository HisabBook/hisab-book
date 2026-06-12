import { useState, useMemo } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';

export const useExpenseFilters = (data) => {
  const [isFiltering, setIsFiltering] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    currency: '',
    startDate: '',
    endDate: '',
  });

  const debouncedFilters = useDebounce(filters, 300);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ category: '', currency: '', startDate: '', endDate: '' });
  };

  const filteredData = useMemo(() => {
    setIsFiltering(true);
    const { category, currency, startDate, endDate } = debouncedFilters;

    const result = data.filter((item) => {
      if (category && item.category !== category) return false;
      if (currency && item.currency !== currency) return false;

      const itemDate = new Date(item.date);
      if (startDate && itemDate < new Date(startDate)) return false;
      // Add 1 day to endDate to include the selected day
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        if (itemDate >= end) return false;
      }

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
  };
};
