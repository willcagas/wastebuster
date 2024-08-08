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
                tabBarShowLabel: false,
                tabBarLabel: 'Discover',
                tabBarIcon: ({color}) => (
                    <FontAwesome6 name="binoculars" color={color} size={31} />
                )
            }}
        />
        <Tabs.Screen 
            name="redesign" 
            options={{
                tabBarShowLabel: false,
                tabBarLabel: 'Redesign',
                tabBarIcon: ({color}) => (
                    <Octicons name="paintbrush" color={color} size={30} />
                )
            }}
        />
        <Tabs.Screen 
            name="events" 
            options={{
                tabBarLabel: 'Events',
                tabBarShowLabel: false,
                headerTitle: 'Events',
                headerTitleAlign: 'left',
                headerTitleStyle: {
                    fontFamily: 'mon-b',
                    fontSize: 30
                },
                headerShadowVisible: false,
                tabBarIcon: ({color}) => (
                    <Ionicons name="earth" color={color} size={35} />
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
                tabBarShowLabel: false,
                headerTitle: 'More',
                headerTitleAlign: 'left',
                headerTitleStyle: {
                    fontFamily: 'mon-b',
                    fontSize: 30
                },
                headerShadowVisible: false,
                tabBarIcon: ({color}) => (
                    <FontAwesome name="leaf" color={color} size={33} />
                )
            }}
        />
    </Tabs>
  )
}

export default Layout