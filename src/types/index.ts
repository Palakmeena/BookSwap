export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  rating: number;
  distance: string;
  owner: {
    name: string;
    avatar: string;
  };
  description?: string;
  isAvailable?: boolean;
}

export interface Genre {
  id: string;
  name: string;
  image: string;
  bookCount: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  avatar: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  distance: string;
  booksListed: number;
}
