import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useLayoutEffect } from 'react';
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import TrackingScreen from "../screens/TrackingScreen";
import AboutScreen from "../screens/AboutScreen";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Home";

// function getHeaderTitle(route) {
//     const routeName = getFocusedRouteNameFromRoute(route) ?? INITIAL_ROUTE_NAME;

//     if (routeName === "Home") {
//         return "How to get started";
//     } else if (routeName === "RecordEvents") {
//         return "Links to learn more";
//     }
// }

export default function BottomTabNavigator({ navigation, route }) {
    useLayoutEffect(() => {
        if (navigation != null) {
            navigation.setOptions({ headerTitle: getHeaderTitle(route) })
        }
    }, [route]);

    return (
        <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME} screenOptions={{
            tabBarStyle: styles.tabBarStyle,
        }}>
            <BottomTab.Screen 
                name='Home'
                component={HomeScreen}
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} name='home' />
                    ),
                }}
            />
            <BottomTab.Screen 
                name='Tracking'
                component={TrackingScreen}
                options={{
                    title: 'Tracking',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} name='analytics-outline' />
                    ),
                }}
            />
            <BottomTab.Screen 
                name='About'
                component={AboutScreen}
                options={{
                    title: 'About',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon focused={focused} name='information-circle-outline' />
                    ),
                }}
            />
        </BottomTab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBarStyle: {
      borderTopWidth: 1,
      borderTopColor: '#ccc',
      backgroundColor: '#fff',
    },
  });