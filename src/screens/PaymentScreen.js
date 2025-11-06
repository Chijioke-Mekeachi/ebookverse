// src/screens/PaymentScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BooksContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const PaymentScreen = () => {
  const { colors } = useTheme();
  const { purchaseBook } = useBooks();
  const navigation = useNavigation();
  const route = useRoute();
  const { book } = route.params;
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      const success = await purchaseBook(book.id, `txn_${Date.now()}`);
      setIsProcessing(false);
      
      if (success) {
        Alert.alert(
          'Payment Successful',
          `You have successfully purchased "${book.title}"`,
          [
            {
              text: 'Read Now',
              onPress: () => navigation.navigate('Reader', { book })
            },
            {
              text: 'Go to Library',
              onPress: () => navigation.navigate('Library')
            }
          ]
        );
      } else {
        Alert.alert('Payment Failed', 'Please try again later.');
      }
    }, 3000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    author: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    paymentCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
    },
    amount: {
      fontSize: 48,
      fontWeight: '700',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 20,
    },
    paymentMethod: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    paymentMethodText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
    },
    payButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
    },
    payButtonDisabled: {
      opacity: 0.6,
    },
    payButtonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
    },
    features: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
    },
    feature: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    featureText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 12,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>
      </View>

      <View style={styles.paymentCard}>
        <Text style={styles.amount}>${book.price}</Text>
        
        <View style={styles.paymentMethod}>
          <Ionicons name="card" size={24} color={colors.primary} />
          <Text style={styles.paymentMethodText}>Credit/Debit Card</Text>
        </View>
        
        <View style={styles.paymentMethod}>
          <Ionicons name="phone-portrait" size={24} color={colors.primary} />
          <Text style={styles.paymentMethodText}>Mobile Money</Text>
        </View>

        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.payButtonText}>Pay Now</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.featureText}>Lifetime access</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.featureText}>Offline reading</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.featureText}>Free updates</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.featureText}>Sync across devices</Text>
        </View>
      </View>
    </View>
  );
};

export default PaymentScreen;