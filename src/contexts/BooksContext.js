// src/contexts/BooksContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { bookService } from '../services/bookService';

const BooksContext = createContext();

// Pre-populated dummy purchased and downloaded books for testing
const DUMMY_PURCHASED_BOOKS = [
  {
    bookId: '1', // The Great Gatsby
    purchaseDate: '2024-01-15T10:30:00.000Z',
    transactionId: 'txn_demo_001',
    downloadUrl: 'https://example.com/books/great-gatsby.epub',
    readingProgress: 45,
    lastRead: '2024-03-20T14:25:00.000Z',
  },
  {
    bookId: '4', // Atomic Habits
    purchaseDate: '2024-02-20T16:45:00.000Z',
    transactionId: 'txn_demo_002',
    downloadUrl: 'https://example.com/books/atomic-habits.epub',
    readingProgress: 80,
    lastRead: '2024-03-21T09:15:00.000Z',
  }
];

const DUMMY_DOWNLOADED_BOOKS = [
  {
    bookId: '1', // The Great Gatsby
    downloadDate: '2024-01-15T11:00:00.000Z',
    localPath: 'file:///storage/emulated/0/Download/The Great Gatsby.epub',
    fileSize: 2048576, // 2MB
  },
  {
    bookId: '3', // The Art of War (free book)
    downloadDate: '2024-03-10T13:20:00.000Z',
    localPath: 'file:///storage/emulated/0/Download/The Art of War.epub',
    fileSize: 1572864, // 1.5MB
  },
  {
    bookId: '4', // Atomic Habits
    downloadDate: '2024-02-20T17:00:00.000Z',
    localPath: 'file:///storage/emulated/0/Download/Atomic Habits.epub',
    fileSize: 2621440, // 2.5MB
  }
];

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [purchasedBooks, setPurchasedBooks] = useState(DUMMY_PURCHASED_BOOKS);
  const [downloadedBooks, setDownloadedBooks] = useState(DUMMY_DOWNLOADED_BOOKS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const booksData = await bookService.fetchBooks();
      setBooks(booksData);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseBook = async (bookId, transactionId = `txn_demo_${Date.now()}`) => {
    try {
      const book = books.find(b => b.id === bookId);
      if (!book) return false;

      // Check if already purchased
      if (purchasedBooks.some(pb => pb.bookId === bookId)) {
        console.log('Book already purchased:', book.title);
        return true;
      }

      const purchasedBook = {
        bookId,
        purchaseDate: new Date().toISOString(),
        transactionId,
        downloadUrl: book.bookUrl,
        readingProgress: 0,
        lastRead: new Date().toISOString(),
      };

      const updatedPurchasedBooks = [...purchasedBooks, purchasedBook];
      setPurchasedBooks(updatedPurchasedBooks);
      
      console.log('Purchased book:', book.title);
      return true;
    } catch (error) {
      console.error('Error purchasing book:', error);
      return false;
    }
  };

  const downloadBook = async (book) => {
    try {
      // Check if already downloaded
      if (downloadedBooks.some(db => db.bookId === book.id)) {
        console.log('Book already downloaded:', book.title);
        return true;
      }

      const downloadedBook = {
        bookId: book.id,
        downloadDate: new Date().toISOString(),
        localPath: `file:///storage/emulated/0/Download/${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.epub`,
        fileSize: Math.floor(Math.random() * 2000000) + 1000000, // 1-3MB random size
      };

      const updatedDownloadedBooks = [...downloadedBooks, downloadedBook];
      setDownloadedBooks(updatedDownloadedBooks);
      
      console.log('Downloaded book:', book.title);
      return true;
    } catch (error) {
      console.error('Error downloading book:', error);
      return false;
    }
  };

  const removeDownload = async (bookId) => {
    try {
      const updatedDownloadedBooks = downloadedBooks.filter(book => book.bookId !== bookId);
      setDownloadedBooks(updatedDownloadedBooks);
      console.log('Removed download for book ID:', bookId);
    } catch (error) {
      console.error('Error removing download:', error);
    }
  };

  const updateReadingProgress = async (bookId, progress) => {
    try {
      const updatedBooks = purchasedBooks.map(book =>
        book.bookId === bookId
          ? { 
              ...book, 
              readingProgress: Math.min(100, Math.max(0, progress)), // Clamp between 0-100
              lastRead: new Date().toISOString() 
            }
          : book
      );
      setPurchasedBooks(updatedBooks);
      console.log('Updated reading progress for book ID:', bookId, 'Progress:', progress + '%');
    } catch (error) {
      console.error('Error updating reading progress:', error);
    }
  };

  const isBookPurchased = (bookId) => {
    return purchasedBooks.some(book => book.bookId === bookId);
  };

  const isBookDownloaded = (bookId) => {
    return downloadedBooks.some(book => book.bookId === bookId);
  };

  // Helper to get book details by ID
  const getBookById = (bookId) => {
    return books.find(book => book.id === bookId);
  };

  // Helper to get purchased books with full details
  const getPurchasedBooksWithDetails = () => {
    return purchasedBooks.map(purchased => {
      const book = getBookById(purchased.bookId);
      return { ...book, ...purchased };
    });
  };

  // Helper to get downloaded books with full details
  const getDownloadedBooksWithDetails = () => {
    return downloadedBooks.map(downloaded => {
      const book = getBookById(downloaded.bookId);
      return { ...book, ...downloaded };
    });
  };

  const value = {
    books,
    purchasedBooks,
    downloadedBooks,
    isLoading,
    purchaseBook,
    downloadBook,
    removeDownload,
    updateReadingProgress,
    isBookPurchased,
    isBookDownloaded,
    getBookById,
    getPurchasedBooksWithDetails,
    getDownloadedBooksWithDetails,
  };

  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
};