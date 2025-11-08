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
import { WebView } from 'react-native-webview';

const PaymentScreen = () => {
  const { colors } = useTheme();
  const { purchaseBook } = useBooks();
  const navigation = useNavigation();
  const route = useRoute();
  const { book } = route.params;
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  // Paystack configuration (use test keys for development)
  const PAYSTACK_PUBLIC_KEY = 'pk_test_your_paystack_public_key_here'; // Replace with your Paystack public key
  const PAYSTACK_BASE_URL = 'https://api.paystack.co';

  // Convert price to Naira
  const convertToNaira = (usdPrice) => {
    const exchangeRate = 1500; // 1 USD = 1500 NGN
    return Math.round(usdPrice * exchangeRate);
  };

  const initializePaystackPayment = async () => {
    setIsProcessing(true);
    
    try {
      const amountInNaira = convertToNaira(book.price);
      const reference = `book_${book.id}_${Date.now()}`;
      
      // For demo purposes - in production, this should be done on your backend
      const paymentData = {
        email: 'customer@example.com', // You can make this dynamic
        amount: amountInNaira * 100, // Paystack expects amount in kobo
        reference: reference,
        metadata: {
          book_id: book.id,
          book_title: book.title,
          customer_name: 'Book Reader', // Get from user profile
        },
        callback_url: 'https://standard.paystack.co/close', // Paystack default close URL
      };

      // Initialize Paystack payment directly (for development only)
      const response = await initializePaymentDirectly(paymentData);
      
      if (response.status && response.data.authorization_url) {
        setPaymentUrl(response.data.authorization_url);
        setShowWebView(true);
      } else {
        throw new Error(response.message || 'Failed to initialize payment');
      }
      
    } catch (error) {
      console.error('Payment initialization error:', error);
      Alert.alert(
        'Payment Error', 
        error.message || 'Failed to initialize payment. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Direct Paystack initialization (for development - move to backend in production)
  const initializePaymentDirectly = async (paymentData) => {
    try {
      const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_PUBLIC_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      return await response.json();
    } catch (error) {
      throw new Error('Network error: Unable to connect to payment service');
    }
  };

  const handleWebViewNavigationStateChange = (navState) => {
    const { url } = navState;
    
    // Check for successful payment
    if (url.includes('success') || url.includes('trxref')) {
      // Extract reference from URL
      const urlParams = new URL(url);
      const reference = urlParams.searchParams.get('trxref') || urlParams.searchParams.get('reference');
      
      if (reference) {
        verifyPayment(reference);
      }
    } else if (url.includes('close') || url.includes('cancel')) {
      // Payment cancelled or window closed
      setShowWebView(false);
      Alert.alert('Payment Cancelled', 'You cancelled the payment process.');
    }
  };

  const verifyPayment = async (reference) => {
    setIsProcessing(true);
    
    try {
      // Verify payment with Paystack
      const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_PUBLIC_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const verificationData = await response.json();

      if (verificationData.status && verificationData.data.status === 'success') {
        // Payment verified successfully
        await handlePaymentSuccess(reference, verificationData.data);
      } else {
        throw new Error('Payment verification failed');
      }
      
    } catch (error) {
      console.error('Payment verification error:', error);
      Alert.alert(
        'Verification Failed', 
        'Payment verification failed. Please contact support with your transaction reference.'
      );
    } finally {
      setIsProcessing(false);
      setShowWebView(false);
    }
  };

  const handlePaymentSuccess = async (reference, paymentData) => {
    const success = await purchaseBook(book.id, reference);
    
    if (success) {
      Alert.alert(
        'Payment Successful! 🎉',
        `You have successfully purchased "${book.title}" for ₦${convertToNaira(book.price).toLocaleString()}`,
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
      Alert.alert(
        'Purchase Record Failed',
        'Payment was successful but we encountered an issue recording your purchase. Please contact support.',
        [{ text: 'OK', onPress: () => navigation.navigate('Library') }]
      );
    }
  };

  const handleManualVerification = () => {
    Alert.alert(
      'Verify Payment',
      'If your payment was successful but you cannot access the book, please contact support with your transaction reference.',
      [
        {
          text: 'Try Again',
          onPress: () => setShowWebView(false)
        },
        {
          text: 'OK',
          style: 'cancel'
        }
      ]
    );
  };

  const simulateTestPayment = () => {
    Alert.alert(
      'Test Payment',
      'For testing purposes, you can simulate a successful payment. In production, this would use real Paystack integration.',
      [
        {
          text: 'Simulate Success',
          onPress: async () => {
            const success = await purchaseBook(book.id, `test_txn_${Date.now()}`);
            if (success) {
              Alert.alert(
                'Test Payment Successful',
                `Test purchase of "${book.title}" completed.`,
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
            }
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
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
      fontSize: 32,
      fontWeight: '700',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 10,
    },
    amountNote: {
      fontSize: 14,
      color: colors.textSecondary,
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
      marginBottom: 20,
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
    webViewContainer: {
      flex: 1,
      marginTop: 50,
    },
    manualVerificationButton: {
      backgroundColor: colors.secondary,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 10,
    },
    manualVerificationText: {
      color: colors.text,
      fontSize: 14,
    },
    testButton: {
      backgroundColor: colors.textSecondary,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 10,
    },
    testButtonText: {
      color: colors.background,
      fontSize: 14,
      fontWeight: '600',
    },
    securityNote: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 10,
      fontStyle: 'italic',
    },
  });

  if (showWebView) {
    return (
      <View style={styles.webViewContainer}>
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          style={{ flex: 1 }}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: 10, color: colors.text }}>Loading Paystack...</Text>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.manualVerificationButton}
          onPress={handleManualVerification}
        >
          <Text style={styles.manualVerificationText}>
            Having issues? Verify payment manually
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>
      </View>

      <View style={styles.paymentCard}>
        <Text style={styles.amount}>₦{convertToNaira(book.price).toLocaleString()}</Text>
        <Text style={styles.amountNote}>Approximately ${book.price}</Text>
        
        <View style={styles.paymentMethod}>
          <Ionicons name="card" size={24} color={colors.primary} />
          <Text style={styles.paymentMethodText}>Card Payment (Paystack)</Text>
        </View>
        
        <View style={styles.paymentMethod}>
          <Ionicons name="phone-portrait" size={24} color={colors.primary} />
          <Text style={styles.paymentMethodText}>Bank Transfer & USSD</Text>
        </View>

        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={initializePaystackPayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.payButtonText}>Pay with Paystack</Text>
          )}
        </TouchableOpacity>

        {/* Test button for development */}
        <TouchableOpacity
          style={styles.testButton}
          onPress={simulateTestPayment}
        >
          <Text style={styles.testButtonText}>Test Payment (Development)</Text>
        </TouchableOpacity>

        <Text style={styles.securityNote}>
          Secure payment powered by Paystack
        </Text>
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