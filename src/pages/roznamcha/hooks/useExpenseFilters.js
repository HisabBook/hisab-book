import { useState, useMemo } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';

const isEqual = (left, right) => {
  if (left === right) return true;
  if (!left || !right) return false;

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) return false;

  return leftKeys.every((key) => left[key] === right[key]);
};

export const useExpenseFilters = (data) => {
  const [filters, setFilters] = useState({
    category: '',
    currency: '',
    startDate: '',
    endDate: '',
  });

  const debouncedFilters = useDebounce(filters, 300);

  const filteredData = useMemo(() => {
    const { category, currency, startDate, endDate } = debouncedFilters;

    return data.filter((item) => {
      if (category && item.category !== category) return false;
      if (currency && item.currency !== currency) return false;

      try {
        if (startDate) {
          const itemDate = new Date(item.date).setHours(0, 0, 0, 0);
          const filterDate = new Date(startDate).setHours(0, 0, 0, 0);
          if (itemDate < filterDate) return false;
        }
        if (endDate) {
          const itemDate = new Date(item.date).setHours(0, 0, 0, 0);
          const filterDate = new Date(endDate).setHours(0, 0, 0, 0);
          if (itemDate > filterDate) return false;
        }
      } catch (e) {
        console.error('Invalid date format in expense item:', item);
      }

      return true;
    });
  }, [data, debouncedFilters]);

  const isFiltering = !isEqual(filters, debouncedFilters);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ category: '', currency: '', startDate: '', endDate: '' });
  };

  return {
    filters,
    handleFilterChange,
    handleClearFilters,
    filteredData,
    isFiltering,
  };
};
