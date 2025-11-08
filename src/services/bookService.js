// src/services/bookService.js
const mockBooks = [
  {
    id: '1',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel of manners that depicts the emotional development of protagonist Elizabeth Bennet, who learns the error of making hasty judgments and comes to appreciate the difference between the superficial and the essential.',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/1342.kindle.images/epub/1342.epub',
    category: 'Classic Literature',
    rating: 4.8,
    pages: 432,
    language: 'English',
    published: 1813,
    isbn: '9780141439518',
    featured: true,
    content: {
      chapters: 61,
      hasImages: true,
      wordCount: 122000
    }
  },
  {
    id: '2',
    title: 'Moby Dick',
    author: 'Herman Melville',
    description: 'The voyage of the whaling ship Pequod, commanded by Captain Ahab, who leads his crew on a hunt for the great white whale Moby Dick.',
    cover: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/2701.kindle.images/epub/2701.epub',
    category: 'Adventure',
    rating: 4.6,
    pages: 635,
    language: 'English',
    published: 1851,
    isbn: '9780142437247',
    featured: true,
    content: {
      chapters: 135,
      hasImages: true,
      wordCount: 206000
    }
  },
  {
    id: '3',
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    description: 'A masterpiece that chronicles the history of the French invasion of Russia and the impact of the Napoleonic era on Tsarist society.',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/2600.kindle.images/epub/2600.epub',
    category: 'Historical Fiction',
    rating: 4.7,
    pages: 1225,
    language: 'English',
    published: 1869,
    isbn: '9780140447934',
    featured: false,
    content: {
      chapters: 361,
      hasImages: true,
      wordCount: 587000
    }
  },
  {
    id: '4',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    description: 'A collection of twelve short stories featuring the brilliant detective Sherlock Holmes and his friend Dr. Watson.',
    cover: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/1661.kindle.images/epub/1661.epub',
    category: 'Mystery',
    rating: 4.8,
    pages: 307,
    language: 'English',
    published: 1892,
    isbn: '9780140439073',
    featured: true,
    content: {
      chapters: 12,
      hasImages: true,
      wordCount: 115000
    }
  },
  {
    id: '5',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    description: 'A young scientist who creates a sapient creature in an unorthodox scientific experiment.',
    cover: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/84.kindle.images/epub/84.epub',
    category: 'Gothic Horror',
    rating: 4.5,
    pages: 280,
    language: 'English',
    published: 1818,
    isbn: '9780141439471',
    featured: false,
    content: {
      chapters: 24,
      hasImages: true,
      wordCount: 75000
    }
  },
  {
    id: '6',
    title: 'Alice\'s Adventures in Wonderland',
    author: 'Lewis Carroll',
    description: 'A young girl named Alice falls through a rabbit hole into a fantasy world of anthropomorphic creatures.',
    cover: 'https://images.unsplash.com/photo-1543005471-56c1ac0c49c9?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/11.kindle.images/epub/11.epub',
    category: 'Fantasy',
    rating: 4.4,
    pages: 200,
    language: 'English',
    published: 1865,
    isbn: '9780141439761',
    featured: true,
    content: {
      chapters: 12,
      hasImages: true,
      wordCount: 27000
    }
  },
  {
    id: '7',
    title: 'The Count of Monte Cristo',
    author: 'Alexandre Dumas',
    description: 'A classic adventure story about a man who is wrongfully imprisoned, escapes from jail, acquires a fortune, and sets about getting revenge on those responsible for his imprisonment.',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/1184.kindle.images/epub/1184.epub',
    category: 'Adventure',
    rating: 4.8,
    pages: 1276,
    language: 'English',
    published: 1844,
    isbn: '9780140449266',
    featured: false,
    content: {
      chapters: 117,
      hasImages: true,
      wordCount: 464000
    }
  },
  {
    id: '8',
    title: 'Dracula',
    author: 'Bram Stoker',
    description: 'The classic vampire story that introduced Count Dracula and established many conventions of subsequent vampire fantasy.',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/345.kindle.images/epub/345.epub',
    category: 'Gothic Horror',
    rating: 4.6,
    pages: 418,
    language: 'English',
    published: 1897,
    isbn: '9780141439846',
    featured: true,
    content: {
      chapters: 27,
      hasImages: true,
      wordCount: 160000
    }
  },
  {
    id: '9',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    description: 'A philosophical novel about a handsome young man who wishes that his portrait would age instead of himself.',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/174.kindle.images/epub/174.epub',
    category: 'Philosophical Fiction',
    rating: 4.7,
    pages: 254,
    language: 'English',
    published: 1890,
    isbn: '9780141439570',
    featured: false,
    content: {
      chapters: 20,
      hasImages: true,
      wordCount: 78000
    }
  },
  {
    id: '10',
    title: 'The Time Machine',
    author: 'H.G. Wells',
    description: 'A science fiction novella about the adventures of an inventor who builds a machine that can travel through time.',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/35.kindle.images/epub/35.epub',
    category: 'Science Fiction',
    rating: 4.5,
    pages: 118,
    language: 'English',
    published: 1895,
    isbn: '9780141439976',
    featured: true,
    content: {
      chapters: 16,
      hasImages: true,
      wordCount: 32000
    }
  },
  {
    id: '11',
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    description: 'The story of an orphaned girl who becomes a governess and falls in love with her employer, Mr. Rochester.',
    cover: 'https://images.unsplash.com/photo-1543005471-56c1ac0c49c9?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/1260.kindle.images/epub/1260.epub',
    category: 'Gothic Romance',
    rating: 4.7,
    pages: 500,
    language: 'English',
    published: 1847,
    isbn: '9780141441146',
    featured: false,
    content: {
      chapters: 38,
      hasImages: true,
      wordCount: 190000
    }
  },
  {
    id: '12',
    title: 'The Odyssey',
    author: 'Homer',
    description: 'One of the two major ancient Greek epic poems attributed to Homer, detailing the Greek hero Odysseus\'s journey home after the Trojan War.',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/1727.kindle.images/epub/1727.epub',
    category: 'Epic Poetry',
    rating: 4.6,
    pages: 374,
    language: 'English',
    published: -800,
    isbn: '9780140268867',
    featured: true,
    content: {
      chapters: 24,
      hasImages: true,
      wordCount: 120000
    }
  },
  {
    id: '13',
    title: 'The Brothers Karamazov',
    author: 'Fyodor Dostoevsky',
    description: 'A passionate philosophical novel that enters deeply into the ethical debates of God, free will, and morality.',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/28054.kindle.images/epub/28054.epub',
    category: 'Philosophical Fiction',
    rating: 4.8,
    pages: 796,
    language: 'English',
    published: 1880,
    isbn: '9780374528379',
    featured: false,
    content: {
      chapters: 50,
      hasImages: true,
      wordCount: 364000
    }
  },
  {
    id: '14',
    title: 'Ulysses',
    author: 'James Joyce',
    description: 'A landmark novel that follows the movements of Leopold Bloom through Dublin during an ordinary day.',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/4300.kindle.images/epub/4300.epub',
    category: 'Modernist Literature',
    rating: 4.4,
    pages: 730,
    language: 'English',
    published: 1922,
    isbn: '9780141182803',
    featured: true,
    content: {
      chapters: 18,
      hasImages: true,
      wordCount: 265000
    }
  },
  {
    id: '15',
    title: 'The Divine Comedy',
    author: 'Dante Alighieri',
    description: 'An epic poem describing Dante\'s journey through Hell, Purgatory, and Paradise.',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
    price: 0,
    type: 'free',
    bookUrl: 'https://www.gutenberg.org/ebooks/8800.kindle.images/epub/8800.epub',
    category: 'Epic Poetry',
    rating: 4.7,
    pages: 798,
    language: 'English',
    published: 1320,
    isbn: '9780140448955',
    featured: false,
    content: {
      chapters: 100,
      hasImages: true,
      wordCount: 150000
    }
  }
];

// Categories for filtering
export const bookCategories = [
  'All',
  'Classic Literature',
  'Adventure',
  'Historical Fiction',
  'Mystery',
  'Gothic Horror',
  'Fantasy',
  'Philosophical Fiction',
  'Science Fiction',
  'Gothic Romance',
  'Epic Poetry',
  'Modernist Literature'
];

export const bookService = {
  async fetchBooks() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockBooks);
      }, 1000);
    });
  },

  async fetchFeaturedBooks() {
    return mockBooks.filter(book => book.featured);
  },

  async fetchBookById(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockBooks.find(book => book.id === id) || null);
      }, 500);
    });
  },

  async searchBooks(query) {
    return new Promise(resolve => {
      setTimeout(() => {
        const results = mockBooks.filter(book =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.category.toLowerCase().includes(query.toLowerCase()) ||
          book.description.toLowerCase().includes(query.toLowerCase())
        );
        resolve(results);
      }, 800);
    });
  },

  async fetchBooksByCategory(category) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (category === 'All') {
          resolve(mockBooks);
        } else {
          resolve(mockBooks.filter(book => book.category === category));
        }
      }, 600);
    });
  },

  async fetchPopularBooks() {
    return mockBooks
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  },

  async fetchRecentBooks() {
    return mockBooks
      .sort((a, b) => b.published - a.published)
      .slice(0, 6);
  },

  async fetchLongestBooks() {
    return mockBooks
      .sort((a, b) => b.pages - a.pages)
      .slice(0, 5);
  },

  getCategories() {
    return bookCategories;
  },

  // Get book statistics
  getBookStats() {
    const totalBooks = mockBooks.length;
    const totalPages = mockBooks.reduce((sum, book) => sum + book.pages, 0);
    const averageRating = mockBooks.reduce((sum, book) => sum + book.rating, 0) / totalBooks;
    const oldestBook = mockBooks.reduce((oldest, book) => book.published < oldest.published ? book : oldest);
    const longestBook = mockBooks.reduce((longest, book) => book.pages > longest.pages ? book : longest);

    return {
      totalBooks,
      totalPages,
      averageRating: averageRating.toFixed(1),
      oldestBook: oldestBook.title,
      longestBook: longestBook.title,
      totalWords: mockBooks.reduce((sum, book) => sum + book.content.wordCount, 0)
    };
  }
};

// Additional utility functions
export const formatPageCount = (pages) => {
  if (pages > 1000) return `${(pages / 1000).toFixed(1)}k pages`;
  return `${pages} pages`;
};

export const formatWordCount = (wordCount) => {
  if (wordCount > 1000000) return `${(wordCount / 1000000).toFixed(1)}M words`;
  if (wordCount > 1000) return `${(wordCount / 1000).toFixed(1)}k words`;
  return `${wordCount} words`;
};

export const getReadingTime = (wordCount) => {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
};