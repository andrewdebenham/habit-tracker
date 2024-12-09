import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { AuthedUserProvider, useAuthedUser } from './contexts/AuthedUserProvider';
import { TrackingUpdateProvider } from './contexts/TrackingUpdateProvider';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createStackNavigator();

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { user } = useAuthedUser();

  return user ? (
    <View style={styles.container}>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </View>
  ) : (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    const hideSplashScreenAfterDelay = async () => {
      // Wait for 2 seconds before hiding the splash screen
      await new Promise((resolve) => setTimeout(resolve, 2000));
      SplashScreen.hideAsync();
    };

    hideSplashScreenAfterDelay();
  }, []);

  return (
    <AuthedUserProvider>
      <TrackingUpdateProvider>
        <AppContent />
      </TrackingUpdateProvider>
    </AuthedUserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});