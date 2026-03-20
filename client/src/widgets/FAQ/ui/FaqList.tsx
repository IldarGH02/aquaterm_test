import { FAQS } from "@shared/types/faq.types.ts"
import { FC } from 'react';
import { FaqItem } from '@widgets/FAQ/ui/FaqItem.tsx';

interface IFaqListProps {
  items: FAQS[];
  openIndex: number | null;
  toggleFAQ: (value: number) => void;
}

export const FaqList: FC<IFaqListProps> = ({ items, toggleFAQ, openIndex }) => {
  return items && items.map((faq, index) => {
    return <FaqItem faq={faq} index={index} toggleFAQ={toggleFAQ} openIndex={openIndex}/>
  })
}