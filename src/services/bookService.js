// src/services/bookService.js
const mockBooks = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic novel of the Jazz Age that explores themes of idealism, resistance to change, social upheaval, and excess.',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    price: 4.99,
    type: 'paid',
    bookUrl: 'https://example.com/books/great-gatsby.epub',
    category: 'Fiction',
    rating: 4.5,
    pages: 180,
    language: 'English'
  },
  {
    id: '2',
    title: 'React Native Essentials',
    author: 'Jane Developer',
    description: 'Learn React Native from scratch and build amazing cross-platform mobile applications.',
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    price: 9.99,
    type: 'paid',
    bookUrl: 'https://example.com/books/react-native.epub',
    category: 'Technology',
    rating: 4.8,
    pages: 320,
    language: 'English'
  },
  {
    id: '3',
    title: 'The Art of War',
    author: 'Sun Tzu',
    description: 'An ancient Chinese military treatise dating from the Late Spring and Autumn Period.',
    cover: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400',
    price: 0,
    type: 'free',
    bookUrl: 'https://example.com/books/art-of-war.epub',
    category: 'Philosophy',
    rating: 4.7,
    pages: 120,
    language: 'English'
  },
  {
    id: '4',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'Tiny Changes, Remarkable Results: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    price: 7.99,
    type: 'paid',
    bookUrl: 'https://example.com/books/atomic-habits.epub',
    category: 'Self-Help',
    rating: 4.9,
    pages: 280,
    language: 'English'
  }
];

export const bookService = {
  async fetchBooks() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockBooks);
      }, 1500);
    });
  },

  async fetchBookById(id) {
    return mockBooks.find(book => book.id === id) || null;
  },

  async searchBooks(query) {
    return mockBooks.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.category.toLowerCase().includes(query.toLowerCase())
    );
  },

  async fetchBooksByCategory(category) {
    if (category === 'All') return mockBooks;
    return mockBooks.filter(book => book.category === category);
  },
};