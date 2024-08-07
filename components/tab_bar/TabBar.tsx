import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import TabBarButton from '@/components/tab_bar/TabBarButton';
import { BottomTabBarProps, BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { ParamListBase, TabNavigationState, NavigationHelpers } from '@react-navigation/native';
import { Colours } from '@/constants/Colours';

import { SafeAreaView } from 'react-native-safe-area-context'

interface TabBarProps extends BottomTabBarProps {
  state: TabNavigationState<ParamListBase>;
  descriptors: { [key: string]: any };
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}

const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const greyColor = '#737373';

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if(['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? Colours.primary : greyColor}
            label={label.toString()}
          />
        )
      })}
    </SafeAreaView>
  )
}

interface Styles {
  tabbar: ViewStyle;
  tabbarItem?: ViewStyle; 
}

const styles = StyleSheet.create<Styles>({
  tabbar: {
    position: 'absolute',
    paddingTop: 5,
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e2e2'
  }
})

export default TabBar;