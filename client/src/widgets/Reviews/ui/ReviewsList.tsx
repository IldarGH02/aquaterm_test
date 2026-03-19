import { Review } from '@app/types';
import { FC } from 'react';
import { ReviewsItem } from '@widgets/Reviews/ui/ReviewsItem.tsx';

interface IReviewsListProps {
  items: Review[];
}

export const ReviewsList: FC<IReviewsListProps> = ({items}) => {
  return items && items.map((review) => {
    return (
      <ReviewsItem review={review}/>
    )
  })
}