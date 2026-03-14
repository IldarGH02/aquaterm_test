/**
 * Типы для кейсов (Cases/Portfolio)
 */

export interface CaseStudy {
  id: number;
  title: string;
  type: string;
  image: string;
  problem: string;
  solution: string;
  result: string;
  price?: string;
  duration: string;
}
