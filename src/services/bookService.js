// src/services/bookService.js
const mockBooks = [
  {
    id: '24',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    description: 'A series of personal writings by the Roman Emperor Marcus Aurelius, reflecting on Stoic philosophy and self‑discipline.',
    cover: 'https://covers.openlibrary.org/b/id/8231991-L.jpg',
    price: 0,
    type: 'free',
    bookUrl: 'https://archive.org/download/meditations00marcuoft/meditations00marcuoft_epub.epub',
    category: 'Philosophical Fiction',
    rating: 4.8,
    pages: 254,
    language: 'English',
    published: 180,
    isbn: '9780140449334',
    featured: true,
    content: {
      chapters: 12,
      hasImages: false,
      wordCount: 75000
    },
    metadata: {
      series: null,
      seriesOrder: null,
      awards: [],
      themes: ['Stoicism','Self‑discipline','Philosophy','Inner life'],
      maturity: 'PG',
      format: 'Essay / Philosophical'
    }
  },
  {
    id: '25',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'Classic novel in which Elizabeth Bennet deals with issues of manners, upbringing, and marriage in the landed gentry of early 19th‑century England.',
    cover: 'https://covers.openlibrary.org/b/id/8228692-L.jpg',
    price: 0,
    type: 'free',
    bookUrl: 'https://archive.org/download/prideprejudice00austuoft/prideprejudice00austuoft_epub.epub',
    category: 'Classic Literature',
    rating: 4.7,
    pages: 432,
    language: 'English',
    published: 1813,
    isbn: '9780141199078',
    featured: true,
    content: {
      chapters: 61,
      hasImages: false,
      wordCount: 122000
    },
    metadata: {
      series: null,
      seriesOrder: null,
      awards: [],
      themes: ['Society','Marriage','Class','Character'],
      maturity: 'PG',
      format: 'Novel'
    }
  },
  {
    id: '26',
    title: 'Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    description: 'A collection of twelve short detective stories featuring the famed sleuth Sherlock Holmes and his partner Dr Watson.',
    cover: 'https://covers.openlibrary.org/b/id/8223200-L.jpg',
    price: 0,
    type: 'free',
    bookUrl: 'https://archive.org/download/adventuresofsher00doyl_0/adventuresofsher00doyl_0_epub.epub',
    category: 'Mystery',
    rating: 4.6,
    pages: 307,
    language: 'English',
    published: 1892,
    isbn: '9780140439083',
    featured: false,
    content: {
      chapters: 12,
      hasImages: false,
      wordCount: 96000
    },
    metadata: {
      series: null,
      seriesOrder: null,
      awards: [],
      themes: ['Detective','Mystery','Victorian Era','Logic'],
      maturity: 'PG',
      format: 'Short Story Collection'
    }
  }
]


// Categories for filtering
// Update your bookCategories array to include new genres
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
  'Modernist Literature',
  'Dystopian',
  'Cyberpunk',
  'Space Opera',
  'First Contact'
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

// Add these to your existing utility functions
export const getBookSeries = (book) => {
  if (book.metadata && book.metadata.series) {
    return `${book.metadata.series} #${book.metadata.seriesOrder}`;
  }
  return 'Standalone Novel';
};

export const formatPublicationDate = (year) => {
  if (year < 0) {
    return `${Math.abs(year)} BCE`;
  }
  return year.toString();
};

export const getAwardBadges = (book) => {
  if (book.metadata && book.metadata.awards) {
    return book.metadata.awards;
  }
  return [];
};

export const getThemes = (book) => {
  if (book.metadata && book.metadata.themes) {
    return book.metadata.themes;
  }
  return [];
};