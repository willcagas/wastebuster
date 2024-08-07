import React from 'react'
import { Tabs } from 'expo-router'
import { Colours } from '@/constants/Colours'
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TabBar from '@/components/tab_bar/TabBar';

const Layout = () => {
  return (
    <Tabs 
        tabBar={props=> <TabBar {...props} />}
    >
        <Tabs.Screen 
            name="index" 
            options={{
                tabBarLabel: 'Discover',
                headerTitle: 'Discover a solution',
                headerTitleAlign: 'left',
                headerTitleStyle: {
                    fontFamily: 'mon-b',
                    fontSize: 30
                },
                headerShadowVisible: false,
            }}
        />
        <Tabs.Screen 
            name="redesign" 
            options={{
                tabBarLabel: 'Redesign',
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
            }}
        />
    </Tabs>
  )
}

export default Layout