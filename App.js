// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/contexts/AuthContext";
import { BooksProvider } from "./src/contexts/BooksContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoginScreen from "./src/screens/auth/LoginScreen";
import SplashScreen from "./src/screens/SplashScreen";
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BooksProvider>
          <ThemeProvider>
            <NavigationContainer>
            <StatusBar style="auto" />
            <AppNavigator />
            {/* <LoginScreen/> */}
            {/* <SplashScreen/> */}
          </NavigationContainer>
          </ThemeProvider>
        </BooksProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
