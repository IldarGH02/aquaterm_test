import { useState, useCallback } from 'react';

interface UseFaqReturn {
  openIndex: number | null;
  toggleFAQ: (index: number) => void;
}

export const useIndex = (initialIndex: number | null = null): UseFaqReturn => {
  const [openIndex, setOpenIndex] = useState<number | null>(initialIndex);

  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex(prev => prev === index ? null : index);
  }, []);

  const isOpen = useCallback((index: number) => {
    return openIndex === index;
  }, [openIndex]);

  return {
    openIndex,
    toggleFAQ
  };
};