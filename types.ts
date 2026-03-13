
export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  offer: string;
  pains: string[];
  works: string[];
  guarantee: string;
  icon: string;
}

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

export interface Review {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
  date: string;
  image: string;
}

export interface QuizStep {
  id: number;
  question: string;
  options: string[];
}
