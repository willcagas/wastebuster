import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, PressableProps, ViewStyle, TextStyle } from 'react-native';
import { icons } from '@/assets/icons';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colours } from '@/constants/Colours';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';  

interface TabBarButtonProps extends PressableProps {
  isFocused: boolean
  label: string
  routeName: string
  color: string
}

const TabBarButton: React.FC<TabBarButtonProps> = (props) => {
  const { isFocused, label, routeName, color, ...pressableProps } = props
  const scale = useSharedValue(0)

  useEffect(() => {
    scale.value = withSpring(
      isFocused ? 1 : 0,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(
      scale.value,
      [0, 1],
      [1, 1.4]
    );
    const top = interpolate(
      scale.value,
      [0, 1],
      [0, 8]
    );
    return {
        transform: [{ scale: scaleValue }],
        top,
      };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scale.value,
      [0, 1],
      [1, 0]
    );
    return {
      opacity
    };
  });

  return (
    <Pressable {...pressableProps} style={styles.container}>
      <Animated.View style={[animatedIconStyle]}>
        {icons[routeName]({
          color
        })}
      </Animated.View>
      
      <Animated.Text style={[{
        color,
        fontSize: 11
      } as TextStyle, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
};

interface Styles {
  container: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  }
});

export default TabBarButton;