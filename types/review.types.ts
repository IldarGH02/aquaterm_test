/**
 * Типы для отзывов (Reviews)
 */

export interface Review {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
  date: string;
  image: string;
}
