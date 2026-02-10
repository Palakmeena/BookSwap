import type { Book, Genre, Testimonial, User } from '@/types';

export const featuredBook: Book = {
  id: '1',
  title: 'The Midnight Library',
  author: 'Matt Haig',
  cover: '/featured_book.jpg',
  genre: 'Fiction',
  rating: 4.8,
  distance: '12 min away',
  owner: {
    name: 'Priya',
    avatar: '/avatar_priya.jpg',
  },
  description: 'Between life and death there is a library. Every book is another life you could have lived. A warm, hopeful novel about regret, possibility, and second chances.',
  isAvailable: true,
};

export const recentBooks: Book[] = [
  {
    id: '2',
    title: 'The Whispering Leaves',
    author: 'Isabel Chen',
    cover: '/book1.jpg',
    genre: 'Literary Fiction',
    rating: 4.5,
    distance: '0.8 mi',
    owner: { name: 'Maya', avatar: '/avatar_maya.jpg' },
    isAvailable: true,
  },
  {
    id: '3',
    title: 'The Silent Sanctuary',
    author: 'Eleanor Vance',
    cover: '/book2.jpg',
    genre: 'Mystery',
    rating: 4.7,
    distance: '1.2 mi',
    owner: { name: 'Jonas', avatar: '/avatar_jonas.jpg' },
    isAvailable: false,
  },
  {
    id: '4',
    title: 'Neo-Orbital Frontires',
    author: 'Kai Lin',
    cover: '/book3.jpg',
    genre: 'Sci-Fi',
    rating: 4.3,
    distance: '0.5 mi',
    owner: { name: 'Priya', avatar: '/avatar_priya.jpg' },
    isAvailable: true,
  },
  {
    id: '5',
    title: 'Whispers of the Heart',
    author: 'Amelia Rose',
    cover: '/book4.jpg',
    genre: 'Romance',
    rating: 4.6,
    distance: '1.5 mi',
    owner: { name: 'Ava', avatar: '/testimonial_ava.jpg' },
    isAvailable: false,
  },
  {
    id: '6',
    title: 'The Maritime Chronicles',
    author: 'Eleanor Vance',
    cover: '/book5.jpg',
    genre: 'Historical Fiction',
    rating: 4.4,
    distance: '0.9 mi',
    owner: { name: 'Nora', avatar: '/testimonial_nora.jpg' },
    isAvailable: true,
  },
  {
    id: '7',
    title: 'The Whispers of Avalon',
    author: 'Elara Vance',
    cover: '/book6.jpg',
    genre: 'Fantasy',
    rating: 4.8,
    distance: '1.1 mi',
    owner: { name: 'Raj', avatar: '/testimonial_raj.jpg' },
    isAvailable: true,
  },
  {
    id: '8',
    title: 'The Unfolding Path',
    author: 'Marcus Chen',
    cover: '/book7.jpg',
    genre: 'Self-Help',
    rating: 4.2,
    distance: '0.7 mi',
    owner: { name: 'Maya', avatar: '/avatar_maya.jpg' },
    isAvailable: true,
  },
  {
    id: '9',
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    cover: '/book8.jpg',
    genre: 'Classic',
    rating: 4.9,
    distance: '1.3 mi',
    owner: { name: 'Jonas', avatar: '/avatar_jonas.jpg' },
    isAvailable: true,
  },
];

export const genres: Genre[] = [
  { id: '1', name: 'Fiction', image: '/genre_fiction.jpg', bookCount: 24 },
  { id: '2', name: 'Mystery', image: '/genre_mystery.jpg', bookCount: 18 },
  { id: '3', name: 'Sci-Fi', image: '/genre_scifi.jpg', bookCount: 15 },
  { id: '4', name: 'Romance', image: '/genre_romance.jpg', bookCount: 21 },
  { id: '5', name: 'Biography', image: '/genre_biography.jpg', bookCount: 12 },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: "I've read 30 books this year without buying a single one. BookSwap has transformed how I read.",
    author: 'Ava',
    avatar: '/testimonial_ava.jpg',
  },
  {
    id: '2',
    quote: "Met a neighbor who loves the same weird sci-fi I do. Now we have monthly book club meetings!",
    author: 'Raj',
    avatar: '/testimonial_raj.jpg',
  },
  {
    id: '3',
    quote: "My shelf finally breathes—and my TBR list is thriving. The community here is incredible.",
    author: 'Nora',
    avatar: '/testimonial_nora.jpg',
  },
];

export const nearbyUsers: User[] = [
  { id: '1', name: 'Priya', avatar: '/avatar_priya.jpg', distance: '0.8 mi', booksListed: 12 },
  { id: '2', name: 'Jonas', avatar: '/avatar_jonas.jpg', distance: '1.2 mi', booksListed: 8 },
  { id: '3', name: 'Maya', avatar: '/avatar_maya.jpg', distance: '0.5 mi', booksListed: 15 },
];
