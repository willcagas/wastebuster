import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Link, useLocalSearchParams, useNavigation } from 'expo-router'
import clubsData from '@/assets/data/categories.json'
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { Colours } from '@/constants/Colours'

const IMG_HEIGHT = 300
const { height, width } = Dimensions.get('window')

const Page = () => {
  const { id } = useLocalSearchParams<{id: string}>()
  const club = (clubsData as any[]).find((item) => item.id == id)
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const navigation = useNavigation()

  const scrollOffset = useScrollViewOffset(scrollRef)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => <Animated.View style={[headerAnimatedStyle, styles.header]} />,

      headerLeft: () => (
        <TouchableOpacity style={styles.roundBtn} onPress={() => navigation.goBack()}>
          <Ionicons name='chevron-back' size={24} color={'#000'} />
        </TouchableOpacity>
      )
    })
  })

  const imageAnimatedstyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]
          )
        }
      ],
    }
  })

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT /2], [0,1])
    }
  })

  // MIGHT NEED TO USE ASYNC OR SMTH
  const openInstagram = () => {
    if (club?.instagram) {
      Linking.openURL(club.instagram)
    }
  }
 
  return (
    <View style={styles.container}>
      <Animated.ScrollView ref={scrollRef}
      scrollEventThrottle={16}
      >
        <Animated.Image source={require('@/assets/images/placeholder.png')} style={[styles.image, imageAnimatedstyle]} />
        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{club?.name}</Text>
          </View>
          
          <Text style={styles.description}>{club?.description}</Text>

          <View style={styles.filler} />
        </View>
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width,
    height: IMG_HEIGHT
  },
  infoContainer: {
    padding: 24,
    backgroundColor: '#fff'
  },
  headerRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 24,
    fontFamily: 'mon-b',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colours.primary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colours.grey
  },
  filler: {
    height: 850,
  },
  header: {
    backgroundColor: '#fff',
    height: height * 0.15,
    borderBottomColor: Colours.grey,
    borderWidth: StyleSheet.hairlineWidth
  }
})

export default Page