import { View, Text, FlatList, ListRenderItem, TouchableOpacity, StyleSheet, Image, Linking, ImageBackground } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import Animated, { FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight, SlideInRight, SlideOutRight, SlideInLeft, LightSpeedInLeft, LightSpeedOutRight } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colours } from '@/constants/Colours'

interface Props {
  ideas: any[]
  category: string
}

// OPTIMIZE PLS

const Ideas = ({ideas: items, category}: Props) => {
  const [loading, setLoading] = useState(false)
  const listRef = useRef<FlatList>(null)

  useEffect(() => {
    console.log('The Category is ' + category)
    setLoading(true)

    // Backend calls
    setTimeout(() => {
      setLoading(false)
    }, 0)

  }, [category])

  const filteredItems = useMemo(() => 
    items.filter(item => category === 'All' || item.category === category),
    [items, category]
  )

  const renderRow = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity activeOpacity={0.7} delayPressIn={0} onPress={() => Linking.openURL(item?.url)}>
        <Animated.View style={styles.idea} entering={SlideInLeft.delay(450).duration(300)} exiting={SlideOutRight.duration(100)}>
        
        <View style={styles.island}> 
          <View>
            <Animated.Image
              entering={FadeInRight.delay(600).duration(300)} exiting={FadeOutRight.duration(100)}
              source={item.category === "Videos" 
                ? { uri: `https://img.youtube.com/vi/${item.url.split("v=")[1]}/0.jpg` } 
                : item.image
                  ? { uri: item.image }
                  : require('@/assets/images/placeholder.png')
              }
              style={styles.image}
              resizeMode="cover"
            />
            
            <TouchableOpacity style={styles.roundBtn} >
              <Ionicons name='star-outline' size={22} color={'#000'} />
            </TouchableOpacity>
                
            {item.category === "Videos" && (
              // <Ionicons name="logo-youtube" size={38} color="red" style={styles.youtube_ico}/>
              <Animated.Image
                entering={FadeInRight.delay(600).duration(300)} 
                exiting={FadeOutRight.duration(100)}
                source={require('@/assets/images/play.png')} 
                style={styles.youtube_ico} 
              />
            )}
            
          </View>

          <View>
            <Animated.Text style={styles.name} entering={FadeInRight.delay(600).duration(350)} exiting={FadeOutRight.duration(100)}>{item.name}</Animated.Text>

            <Animated.Text entering={FadeInRight.delay(700).duration(350)} exiting={FadeOutRight.duration(100)} style={styles.description}>
              <Text style={{fontFamily: 'mon-b'}}>Description on site:</Text>
              <Text> "{item.description}"</Text>
            </Animated.Text>
            
          </View>
        </View>
        

        </Animated.View>
      </TouchableOpacity>
  ), [])

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1, paddingBottom: 50}}>
      <FlatList 
      renderItem={renderRow}
      ref={listRef}
      data={filteredItems}>
      </FlatList>
    </SafeAreaView>
  )
}

// colour green

const styles = StyleSheet.create({
  idea: {
    padding: 16,
  },
  island: {
    padding: 17.5, 
    paddingTop: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1
    }
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    borderColor: '#fff',
    borderWidth: 5
  },
  roundBtn: {
    width: 35,
    height: 35,
    position: 'absolute',
    top: '6%',
    right: '4%',
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colours.primary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colours.grey,
  },
  roundBtnActive: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: '6%',
    right: '4%',
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colours.primary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colours.grey,
  },
  name: {
    fontFamily: 'mon-b', 
    fontSize: 18,
    paddingTop: 10,
    color: '#000'
  },
  youtube_ico: {
    flex: 1,
    alignSelf: 'center',
    position: 'absolute',
    top: '20%',
    height: 150,
    width: 150,
  },
  description: {
    fontFamily: 'mon',
    paddingTop: 10,
    color: '#000'
  } 
})

export default Ideas