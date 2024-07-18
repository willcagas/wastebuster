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
                tabBarLabel: 'Find',
                tabBarIcon: ({ color, size}) => <FontAwesome6 name='binoculars' size={size} color={color} />
            }}
        />
        <Tabs.Screen 
            name="events" 
            options={{
                tabBarLabel: 'Events',
                tabBarIcon: ({ color, size}) => <Ionicons name='earth' size={size} color={color} />
            }}
        />
        <Tabs.Screen 
            name="redesign" 
            options={{
                tabBarLabel: 'Redesign',
                tabBarIcon: ({ color, size}) => <FontAwesome5 name='lightbulb' size={size} color={color} />
            }}
        />
        <Tabs.Screen 
            name="more" 
            options={{
                tabBarLabel: 'More',
                tabBarIcon: ({ color, size}) => <FontAwesome5 name='lightbulb' size={size} color={color} />
            }}
        />
    </Tabs>
  )
}

export default Layout