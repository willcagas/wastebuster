import React from 'react'
import { Tabs } from 'expo-router'
import { Colours } from '@/constants/Colours'
import { FontAwesome, FontAwesome5, Ionicons, Octicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TabBar from '@/components/tab_bar/TabBar';

const Layout = () => {
  return (
    <Tabs screenOptions={{
        tabBarActiveTintColor: Colours.primary
    }}>
        <Tabs.Screen 
            name="index" 
            options={{
                tabBarIcon: ({color, size}) => (
                    <FontAwesome6 name="binoculars" color={color} size={size} />
                )
            }}
        />
        <Tabs.Screen 
            name="redesign" 
            options={{
                tabBarLabel: 'Redesign',
                tabBarIcon: ({color, size}) => (
                    <Octicons name="paintbrush" color={color} size={size} />
                )
            }}
        />
        <Tabs.Screen 
            name="events" 
            options={{
                tabBarLabel: 'Events',
                headerTitle: 'Events',
                headerTitleAlign: 'left',
                headerTitleStyle: {
                    fontFamily: 'mon-b',
                    fontSize: 30
                },
                headerShadowVisible: false,
                tabBarIcon: ({color, size}) => (
                    <Ionicons name="earth" color={color} size={size} />
                )
            }}
        />
        {/* <Tabs.Screen 
            name="learn" 
            options={{
                tabBarLabel: 'Learn',
                headerTitle: 'Learn',
                headerTitleAlign: 'left',
                headerTitleStyle: {
                    fontFamily: 'mon-b',
                    fontSize: 30
                },
                headerShadowVisible: false,
            }}
        /> */}
        <Tabs.Screen 
            name="more" 
            options={{
                tabBarLabel: 'More',
                headerTitle: 'More',
                headerTitleAlign: 'left',
                headerTitleStyle: {
                    fontFamily: 'mon-b',
                    fontSize: 30
                },
                headerShadowVisible: false,
                tabBarIcon: ({color, size}) => (
                    <FontAwesome name="leaf" color={color} size={size} />
                )
            }}
        />
    </Tabs>
  )
}

export default Layout