// src/screens/ReaderScreen.js
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  Image,
  Animated,
  SafeAreaView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import EPUBViewer from '../services/epubViewer';
import { bookService, formatPageCount, getReadingTime } from '../services/bookService';

const { width, height } = Dimensions.get('window');
const CONTROLS_AUTO_HIDE_TIMEOUT = 4000;

// Get safe area insets for different devices
const getSafeAreaInsets = () => {
  if (Platform.OS === 'ios') {
    return {
      top: 44,
      bottom: 34,
    };
  } else {
    return {
      top: StatusBar.currentHeight || 25,
      bottom: 0,
    };
  }
};

const ReaderScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useRoute();
  const route = useRoute();
  const { book } = route.params || {};
  
  const safeArea = getSafeAreaInsets();
  
  // State management
  const [fontSize, setFontSize] = useState(16);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chapterContent, setChapterContent] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [totalChapters, setTotalChapters] = useState(0);
  const [viewer, setViewer] = useState(null);
  const [isOnlineBook, setIsOnlineBook] = useState(false);
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [currentBookMetadata, setCurrentBookMetadata] = useState(null);
  const [chapters, setChapters] = useState([]);
  
  // Refs
  const webViewRef = useRef(null);
  const scrollViewRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Memoized values
  const progressPercentage = useMemo(() => 
    totalChapters > 0 ? ((currentChapter + 1) / totalChapters) * 100 : 0,
    [currentChapter, totalChapters]
  );

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (isControlsVisible) {
      controlsTimeoutRef.current = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            setIsControlsVisible(false);
          }
        });
      }, CONTROLS_AUTO_HIDE_TIMEOUT);
    }
  }, [isControlsVisible, fadeAnim]);

  const showControls = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    setIsControlsVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    resetControlsTimer();
  }, [resetControlsTimer, fadeAnim]);

  const hideControls = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsControlsVisible(false);
      }
    });
  }, [fadeAnim]);

  const toggleControls = useCallback(() => {
    if (isControlsVisible) {
      hideControls();
    } else {
      showControls();
    }
  }, [isControlsVisible, showControls, hideControls]);

  // Load available books
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const books = await bookService.fetchBooks();
        setAvailableBooks(books);
      } catch (error) {
        console.error('Failed to load books:', error);
      }
    };
    loadBooks();
  }, []);

  // Initialize EPUB viewer
  useEffect(() => {
    const initializeEPUB = async () => {
      try {
        setIsLoading(true);
        
        let epubFile;
        let bookMetadata = book;

        if (book?.bookUrl) {
          epubFile = book.bookUrl;
          bookMetadata = book;
        } else {
          const books = await bookService.fetchBooks();
          const randomBook = books[Math.floor(Math.random() * books.length)];
          epubFile = randomBook.bookUrl;
          bookMetadata = randomBook;
        }

        setCurrentBookMetadata(bookMetadata);

        const epubViewer = new EPUBViewer(epubFile);
        
        epubViewer.on('loaded', ({ isOnline }) => {
          console.log('EPUB loaded successfully', { isOnline });
          const chapters = epubViewer.getChapters();
          setChapters(chapters);
          setTotalChapters(chapters.length);
          setChapterTitle(chapters[0]?.title || 'Chapter 1');
          setIsOnlineBook(isOnline);
        });
        
        epubViewer.on('chapterChanged', ({ index, chapter }) => {
          setChapterTitle(chapter.title);
          setCurrentChapter(index);
        });
        
        epubViewer.on('error', (error) => {
          console.log('EPUB viewer error:', error.message);
          Alert.alert('Error', 'Failed to load book content');
        });
        
        await epubViewer.init();
        
        const chapters = epubViewer.getChapters();
        const content = await epubViewer.getChapterContent(0);
        
        setViewer(epubViewer);
        setChapters(chapters);
        setTotalChapters(chapters.length);
        setChapterTitle(chapters[0]?.title || 'Chapter 1');
        setChapterContent(content);
        setIsOnlineBook(epubViewer.isOnlineBook());
        setIsLoading(false);
        
      } catch (error) {
        console.error('Failed to initialize EPUB:', error);
        Alert.alert('Error', 'Failed to load book. Please try another one.');
        setIsLoading(false);
      }
    };

    initializeEPUB();
  }, [book]);

  // Update WebView when content or settings change
  useEffect(() => {
    if (webViewRef.current && chapterContent) {
      const script = `
        (function() {
          // Update font size and spacing
          document.body.style.fontSize = '${fontSize}px';
          document.body.style.lineHeight = '${fontSize * 1.6}px';
          document.body.style.letterSpacing = '0.3px';
          
          // Update colors for dark/light mode
          document.body.style.color = '${isDark ? '#e0e0e0' : '#333'}';
          document.body.style.backgroundColor = '${isDark ? '#1a1a1a' : '#ffffff'}';
          
          // Update heading colors
          const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          headings.forEach(heading => {
            heading.style.color = '${isDark ? '#ffffff' : '#2c3e50'}';
            heading.style.marginBottom = '0.8em';
          });
          
          // Update blockquote styles
          const blockquotes = document.querySelectorAll('blockquote');
          blockquotes.forEach(blockquote => {
            blockquote.style.backgroundColor = '${isDark ? '#2d2d2d' : '#f8f9fa'}';
            blockquote.style.borderLeftColor = '${colors.primary}';
            blockquote.style.borderLeftWidth = '4px';
            blockquote.style.padding = '12px 16px';
            blockquote.style.margin = '16px 0';
          });
          
          // Improve paragraph spacing
          const paragraphs = document.querySelectorAll('p');
          paragraphs.forEach(p => {
            p.style.marginBottom = '1.2em';
          });
          
          // Enable scrolling and make content fit properly
          document.body.style.height = 'auto';
          document.body.style.minHeight = '100%';
          document.body.style.overflow = 'visible';
          document.documentElement.style.height = 'auto';
          document.documentElement.style.minHeight = '100%';
          
          // Add responsive padding for better reading
          const isMobile = window.innerWidth < 768;
          document.body.style.padding = isMobile ? '20px 16px' : '30px 24px';
          document.body.style.maxWidth = '680px';
          document.body.style.margin = '0 auto';
          document.body.style.wordWrap = 'break-word';
          document.body.style.textAlign = 'justify';
          
          // Scroll to top when chapter changes
          window.scrollTo(0, 0);
        })();
        true;
      `;
      
      webViewRef.current.injectJavaScript(script);
    }
  }, [chapterContent, fontSize, isDark, colors.primary]);

  // Scroll to current chapter when chapter list opens
  useEffect(() => {
    if (showChapterList && scrollViewRef.current && chapters.length > 0) {
      setTimeout(() => {
        const itemHeight = 56;
        const scrollToY = Math.max(0, (currentChapter - 2) * itemHeight);
        scrollViewRef.current?.scrollTo({ y: scrollToY, animated: true });
      }, 100);
    }
  }, [showChapterList, currentChapter, chapters.length]);

  // Set up auto-hide controls
  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimer]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 1, 24));
    resetControlsTimer();
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 1, 12));
    resetControlsTimer();
  };

  const goToNextChapter = async () => {
    console.log('Next chapter button pressed');
    if (!viewer || currentChapter >= totalChapters - 1) {
      Alert.alert('Finished', 'You have reached the end of the book!');
      return;
    }
    
    try {
      setIsLoading(true);
      const content = await viewer.next();
      setCurrentChapter(viewer.getCurrentChapterIndex());
      setChapterContent(content);
      resetControlsTimer();
    } catch (error) {
      console.error('Failed to load next chapter:', error);
      Alert.alert('Error', 'Failed to load next chapter');
    } finally {
      setIsLoading(false);
    }
  };

  const goToPreviousChapter = async () => {
    console.log('Previous chapter button pressed');
    if (!viewer || currentChapter <= 0) {
      Alert.alert('Start', 'You are at the beginning of the book!');
      return;
    }
    
    try {
      setIsLoading(true);
      const content = await viewer.previous();
      setCurrentChapter(viewer.getCurrentChapterIndex());
      setChapterContent(content);
      resetControlsTimer();
    } catch (error) {
      console.error('Failed to load previous chapter:', error);
      Alert.alert('Error', 'Failed to load previous chapter');
    } finally {
      setIsLoading(false);
    }
  };

  const goToChapter = async (index) => {
    if (!viewer || index < 0 || index >= totalChapters) return;
    
    try {
      setIsLoading(true);
      setShowChapterList(false);
      const content = await viewer.goToChapter(index);
      setCurrentChapter(index);
      setChapterContent(content);
      resetControlsTimer();
    } catch (error) {
      console.error('Failed to load chapter:', error);
      Alert.alert('Error', 'Failed to load chapter');
    } finally {
      setIsLoading(false);
    }
  };

  const loadNewBook = async (selectedBook) => {
    try {
      setIsLoading(true);
      setShowBookSelector(false);
      
      const newViewer = new EPUBViewer(selectedBook.bookUrl);
      await newViewer.init();
      
      const chapters = newViewer.getChapters();
      const content = await newViewer.getChapterContent(0);
      const metadata = newViewer.getMetadata();
      
      setViewer(newViewer);
      setCurrentChapter(0);
      setTotalChapters(chapters.length);
      setChapters(chapters);
      setChapterTitle(chapters[0]?.title || 'Chapter 1');
      setChapterContent(content);
      setCurrentBookMetadata(selectedBook);
      setIsOnlineBook(newViewer.isOnlineBook());
      setIsLoading(false);
      
      Alert.alert('Success', `Now reading: ${selectedBook.title}`);
    } catch (error) {
      console.error('Failed to load new book:', error);
      Alert.alert('Error', 'Failed to load the selected book');
      setIsLoading(false);
    }
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message:', data);
    } catch (error) {
      // Ignore non-JSON messages
    }
  };

  const handleScreenTap = () => {
    toggleControls();
    // Close chapter list when tapping screen
    if (showChapterList) {
      setShowChapterList(false);
    }
  };

  const handleWebViewScroll = (event) => {
    // Hide controls when scrolling
    if (isControlsVisible) {
      hideControls();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#f5f5f5',
    },
    safeArea: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      paddingTop: safeArea.top + 12,
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#e0e0e0',
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    headerTitleContainer: {
      flex: 1,
      alignItems: 'center',
      marginHorizontal: 10,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
      textAlign: 'center',
    },
    bookTitleHeader: {
      fontSize: 12,
      color: isDark ? '#bdc3c7' : '#7f8c8d',
      textAlign: 'center',
      marginTop: 2,
    },
    onlineBadge: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: '#27ae60',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    onlineBadgeText: {
      color: '#ffffff',
      fontSize: 8,
      fontWeight: '600',
    },
    webViewContainer: {
      flex: 1,
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
    },
    webViewWrapper: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      paddingTop: safeArea.top,
      paddingBottom: safeArea.bottom,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
      textAlign: 'center',
    },
    // Book Selector Styles
    bookSelector: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.98)',
      paddingTop: safeArea.top + 20,
      paddingBottom: safeArea.bottom + 20,
      paddingHorizontal: 20,
    },
    bookSelectorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    bookSelectorTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#000000',
      textAlign: 'center',
      flex: 1,
    },
    bookList: {
      flex: 1,
    },
    bookItem: {
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#e0e0e0',
    },
    bookItemHeader: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    bookCover: {
      width: 60,
      height: 80,
      borderRadius: 8,
      marginRight: 12,
    },
    bookInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    bookTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    bookAuthor: {
      fontSize: 14,
      color: isDark ? '#bdc3c7' : '#7f8c8d',
      marginBottom: 6,
    },
    bookMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    bookMetaText: {
      fontSize: 12,
      color: isDark ? '#95a5a6' : '#95a5a6',
      marginRight: 6,
    },
    bookDescription: {
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 12,
    },
    bookFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    categoryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    categoryText: {
      color: '#ffffff',
      fontSize: 11,
      fontWeight: '600',
    },
    publishedText: {
      fontSize: 11,
      color: isDark ? '#95a5a6' : '#95a5a6',
      fontStyle: 'italic',
    },
    closeButton: {
      padding: 4,
    },
    // Chapter Dropdown Styles
    chapterDropdown: {
      position: 'absolute',
      top: safeArea.top + 80,
      left: 20,
      right: 20,
      backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#e0e0e0',
      maxHeight: height * 0.6,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 999,
    },
    chapterDropdownHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#444' : '#f0f0f0',
    },
    chapterDropdownTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDark ? '#ffffff' : '#000000',
      marginBottom: 4,
    },
    chapterDropdownSubtitle: {
      fontSize: 12,
      color: isDark ? '#bdc3c7' : '#666',
    },
    chapterList: {
      maxHeight: height * 0.6 - 80,
    },
    chapterItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#3a3a3a' : '#f8f8f8',
    },
    chapterItemActive: {
      backgroundColor: isDark ? '#3a3a3a' : '#f8f9fa',
    },
    chapterNumber: {
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    chapterNumberText: {
      fontSize: 11,
      fontWeight: '600',
      color: isDark ? '#bdc3c7' : '#666',
    },
    chapterNumberTextActive: {
      color: colors.primary,
    },
    chapterInfo: {
      flex: 1,
    },
    chapterTitleText: {
      fontSize: 14,
    },
    chapterTitleTextActive: {
      color: colors.primary,
      fontWeight: '600',
    },
    currentIndicator: {
      marginLeft: 8,
    },
    // Controls Styles
    controls: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      padding: 16,
      paddingBottom: safeArea.bottom + 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#333333' : '#e0e0e0',
      zIndex: 100,
    },
    controlRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    chapterControls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    chapterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.primary,
      minWidth: 80,
      alignItems: 'center',
    },
    chapterButtonDisabled: {
      backgroundColor: isDark ? '#333333' : '#cccccc',
    },
    chapterButtonText: {
      color: '#ffffff',
      fontWeight: '600',
      fontSize: 14,
    },
    chapterNavButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: isDark ? '#2d2d2d' : '#f0f0f0',
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 8,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    chapterNavButtonText: {
      color: isDark ? '#ffffff' : '#000000',
      fontWeight: '600',
      fontSize: 14,
      marginRight: 4,
    },
    fontControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    fontButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 12,
    },
    fontSizeText: {
      fontSize: 16,
      color: isDark ? '#ffffff' : '#000000',
      fontWeight: '600',
      minWidth: 50,
      textAlign: 'center',
    },
    progressBar: {
      height: 4,
      backgroundColor: isDark ? '#333333' : '#e0e0e0',
      borderRadius: 2,
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    progressText: {
      fontSize: 12,
      color: isDark ? '#ffffff' : '#000000',
      textAlign: 'center',
      marginBottom: 12,
    },
    tapArea: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'transparent',
      zIndex: 1,
    },
  });

  if (showBookSelector) {
    return (
      <SafeAreaView style={[styles.container, styles.bookSelector]}>
        <View style={styles.bookSelectorHeader}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowBookSelector(false)}
          >
            <Ionicons 
              name="close" 
              size={24} 
              color={isDark ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
          
          <Text style={styles.bookSelectorTitle}>Choose a Book</Text>
          <View style={{ width: 32 }} /> {/* Spacer for alignment */}
        </View>
        
        <Text style={[styles.bookDescription, { textAlign: 'center', marginBottom: 20 }]}>
          Select from {availableBooks.length} classic books
        </Text>
        
        <ScrollView 
          style={styles.bookList} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {availableBooks.map((bookItem) => (
            <TouchableOpacity
              key={bookItem.id}
              style={[styles.bookItem, { backgroundColor: isDark ? '#2d2d2d' : '#ffffff' }]}
              onPress={() => loadNewBook(bookItem)}
            >
              <View style={styles.bookItemHeader}>
                <Image 
                  source={{ uri: bookItem.cover }} 
                  style={styles.bookCover}
                  resizeMode="cover"
                />
                <View style={styles.bookInfo}>
                  <Text style={[styles.bookTitle, { color: isDark ? '#ffffff' : '#000000' }]} numberOfLines={2}>
                    {bookItem.title}
                  </Text>
                  <Text style={styles.bookAuthor}>by {bookItem.author}</Text>
                  <View style={styles.bookMeta}>
                    <Text style={styles.bookMetaText}>{formatPageCount(bookItem.pages)}</Text>
                    <Text style={styles.bookMetaText}>•</Text>
                    <Text style={styles.bookMetaText}>{getReadingTime(bookItem.content?.wordCount)}</Text>
                    <Text style={styles.bookMetaText}>•</Text>
                    <Text style={styles.bookMetaText}>{bookItem.rating} ★</Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.bookDescription, { color: isDark ? '#bdc3c7' : '#666' }]} numberOfLines={2}>
                {bookItem.description}
              </Text>
              <View style={styles.bookFooter}>
                <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.categoryText}>{bookItem.category}</Text>
                </View>
                <Text style={styles.publishedText}>
                  {bookItem.published > 0 ? bookItem.published : Math.abs(bookItem.published) + ' BCE'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isLoading && !chapterContent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            {currentBookMetadata ? `Loading ${currentBookMetadata.title}...` : 'Loading book...'}
          </Text>
          {currentBookMetadata && (
            <Text style={[styles.loadingText, { fontSize: 14, marginTop: 8 }]}>
              by {currentBookMetadata.author}
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        backgroundColor={isDark ? '#000000' : '#ffffff'} 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
      />
      
      <View style={styles.safeArea}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {isControlsVisible && (
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons 
                    name="chevron-back" 
                    size={24} 
                    color={isDark ? '#ffffff' : '#000000'} 
                  />
                </TouchableOpacity>
                
                <View style={styles.headerTitleContainer}>
                  <Text style={styles.headerTitle} numberOfLines={1}>
                    {chapterTitle}
                  </Text>
                  {currentBookMetadata && (
                    <Text style={styles.bookTitleHeader} numberOfLines={1}>
                      {currentBookMetadata.title}
                    </Text>
                  )}
                  {isOnlineBook && (
                    <View style={styles.onlineBadge}>
                      <Text style={styles.onlineBadgeText}>ONLINE</Text>
                    </View>
                  )}
                </View>
                
                <TouchableOpacity onPress={() => setShowBookSelector(true)}>
                  <Ionicons 
                    name="library-outline" 
                    size={24} 
                    color={isDark ? '#ffffff' : '#000000'} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>

        {/* WebView Container */}
        <View style={styles.webViewWrapper}>
          <WebView
            ref={webViewRef}
            source={{ html: chapterContent }}
            onMessage={handleWebViewMessage}
            style={styles.webViewContainer}
            onLoadEnd={() => setIsLoading(false)}
            onLoadStart={() => setIsLoading(true)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            onScroll={handleWebViewScroll}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading chapter...</Text>
              </View>
            )}
          />
          
          {/* Transparent tap area */}
          <TouchableOpacity 
            style={styles.tapArea}
            activeOpacity={1}
            onPress={handleScreenTap}
          />
          
          {isLoading && (
            <View style={[styles.loadingContainer, StyleSheet.absoluteFill]}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading chapter...</Text>
            </View>
          )}
        </View>

        {/* Chapter Dropdown List */}
        {showChapterList && (
          <View style={styles.chapterDropdown}>
            <View style={styles.chapterDropdownHeader}>
              <Text style={styles.chapterDropdownTitle}>Chapters</Text>
              <Text style={styles.chapterDropdownSubtitle}>
                {totalChapters} chapters • Current: {currentChapter + 1}
              </Text>
            </View>
            <ScrollView 
              style={styles.chapterList}
              showsVerticalScrollIndicator={true}
              ref={scrollViewRef}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {chapters.map((chapter, index) => (
                <TouchableOpacity
                  key={`chapter-${index}`}
                  style={[
                    styles.chapterItem,
                    index === currentChapter && styles.chapterItemActive,
                    { backgroundColor: isDark ? '#2d2d2d' : '#ffffff' }
                  ]}
                  onPress={() => goToChapter(index)}
                >
                  <View style={[styles.chapterNumber, { backgroundColor: isDark ? '#444' : '#f0f0f0' }]}>
                    <Text style={[
                      styles.chapterNumberText,
                      index === currentChapter && styles.chapterNumberTextActive
                    ]}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={styles.chapterInfo}>
                    <Text 
                      style={[
                        styles.chapterTitleText,
                        { color: isDark ? '#e0e0e0' : '#333' },
                        index === currentChapter && styles.chapterTitleTextActive
                      ]}
                      numberOfLines={1}
                    >
                      {chapter.title}
                    </Text>
                  </View>
                  {index === currentChapter && (
                    <View style={styles.currentIndicator}>
                      <Ionicons name="checkmark" size={16} color={colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Controls */}
        <Animated.View style={[styles.controls, { opacity: fadeAnim }]}>
          {isControlsVisible && (
            <>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
              </View>
              <Text style={styles.progressText}>
                Chapter {currentChapter + 1} of {totalChapters} ({Math.round(progressPercentage)}%)
                {currentBookMetadata && ` • ${currentBookMetadata.title}`}
              </Text>
              
              <View style={styles.chapterControls}>
                <TouchableOpacity 
                  style={[
                    styles.chapterButton,
                    currentChapter <= 0 && styles.chapterButtonDisabled
                  ]}
                  onPress={goToPreviousChapter}
                  disabled={currentChapter <= 0}
                >
                  <Text style={styles.chapterButtonText}>Previous</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.chapterNavButton}
                  onPress={() => setShowChapterList(!showChapterList)}
                >
                  <Text style={styles.chapterNavButtonText}>
                    Chapters ({currentChapter + 1}/{totalChapters})
                  </Text>
                  <Ionicons 
                    name={showChapterList ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color={isDark ? '#ffffff' : '#000000'} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.chapterButton,
                    currentChapter >= totalChapters - 1 && styles.chapterButtonDisabled
                  ]}
                  onPress={goToNextChapter}
                  disabled={currentChapter >= totalChapters - 1}
                >
                  <Text style={styles.chapterButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.controlRow}>
                <TouchableOpacity 
                  style={styles.fontButton}
                  onPress={decreaseFontSize}
                >
                  <Ionicons name="remove" size={20} color="#ffffff" />
                </TouchableOpacity>
                
                <View style={styles.fontControls}>
                  <Text style={[styles.fontSizeText, { fontSize: 14 }]}>A</Text>
                  <Text style={styles.fontSizeText}>{fontSize}px</Text>
                  <Text style={[styles.fontSizeText, { fontSize: 18 }]}>A</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.fontButton}
                  onPress={increaseFontSize}
                >
                  <Ionicons name="add" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default ReaderScreen;