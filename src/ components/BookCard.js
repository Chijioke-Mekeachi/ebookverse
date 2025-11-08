// src/components/BookCard.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const BookCard = ({ book, onPress }) => {
  const { currentTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onPress(book)}
      className="w-40 mr-4 mb-4 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: currentTheme === 'dark' ? '#374151' : '#ffffff',
        shadowColor: currentTheme === 'dark' ? '#000' : '#6b7280',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Image
        source={{ uri: book.cover }}
        className="w-full h-56 rounded-t-2xl"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text 
          className="font-semibold text-sm mb-1" 
          numberOfLines={2}
          style={{ color: currentTheme === 'dark' ? '#f9fafb' : '#111827' }}
        >
          {book.title}
        </Text>
        <Text 
          className="text-xs mb-2"
          style={{ color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280' }}
        >
          {book.author}
        </Text>
        <View className="flex-row justify-between items-center">
          <Text 
            className="font-bold text-sm"
            style={{ color: currentTheme === 'dark' ? '#60a5fa' : '#3b82f6' }}
          >
            {book.type === 'free' ? 'Free' : `$${book.price}`}
          </Text>
          <View className="flex-row items-center">
            <Text 
              className="text-xs mr-1"
              style={{ color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280' }}
            >
              ⭐ {book.rating}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};