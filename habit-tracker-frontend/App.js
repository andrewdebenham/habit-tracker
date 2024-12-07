import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { AuthedUserProvider, useAuthedUser } from './contexts/AuthedUserProvider';
import { TrackingUpdateProvider } from './contexts/TrackingUpdateProvider';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

const Stack = createStackNavigator();

function AppContent() {
  const { user, loading } = useAuthedUser();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return user ? (
    <View style={styles.container}>
      <NavigationContainer>
        <BottomTabNavigator/>
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
