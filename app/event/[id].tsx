import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Link, useLocalSearchParams, useNavigation } from 'expo-router'
import eventData from '@/assets/data/events.json'
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated'
import { Fontisto, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Colours } from '@/constants/Colours'
import ReadMore from '@fawazahmed/react-native-read-more'

const IMG_HEIGHT = 300
const { height, width } = Dimensions.get('window')

const formatTimeRange = (isoDateString: string, durationHours: number): string => {
  const startDate = new Date(isoDateString);
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  const startTime = startDate.toLocaleString('en-US', formatOptions);
  const endTime = endDate.toLocaleString('en-US', formatOptions);

  return `${startTime} - ${endTime}`;
}

const formatMonth = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString('en-US', {
    month: 'short'
  });
}

const formatDay = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric'
  });
}

const Page = () => {
  const { id } = useLocalSearchParams<{id: string}>()
  const event = (eventData as any[]).find((item) => item.id == id)
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


  return (
    <View style={styles.container}>
      <Animated.ScrollView ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.Image source={event.image
                    ? { uri: event.image }
                    : require('@/assets/images/miscellaneous/placeholder.png')} style={[styles.image, imageAnimatedstyle]} />
        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.name, {width: '80%'}]}>{event?.name}</Text>

            <View style={styles.productCard}>
              <Text style={[styles.date]}>{formatMonth(event?.date)}</Text>
              <Text style={[styles.date, {fontSize: 24}]}>{formatDay(event?.date)}</Text>
            </View>
          </View>
            
          <Text style={[styles.description, {color: '#3A3B3C'}]}>By {event?.organization}</Text>

          <View style={styles.details}> 
            <View style={styles.detailRow}>
              <MaterialIcons name="location-city" size={24} color={Colours.primary} />
              <Text style={{fontFamily: 'mon-sb'}}>{event?.location}</Text>
            </View>
            
            <View style={[styles.detailRow, {marginLeft: -2}]}>
              <Ionicons name="location-sharp" size={26} color={Colours.primary} />
              <Text style={{fontFamily: 'mon-sb'}}>{event?.address}</Text>
            </View>

            <View style={[styles.detailRow, {gap: 14}]}>
              <Fontisto name="clock" size={20} color={Colours.primary} />
              <Text style={{fontFamily: 'mon-sb'}}>{formatTimeRange(event?.date, event?.duration)}</Text>
            </View>
          </View>

          <Text style={styles.subheader}>About</Text>

          <ReadMore numberOfLines={7} seeMoreStyle={styles.seeText} seeLessStyle={styles.seeText} style={[styles.description, {fontSize: 15, color: '#3A3B3C', paddingBottom: 20}]}>
            {event?.description || "Nothing here yet..."}
          </ ReadMore>
        </View>
      </Animated.ScrollView>
      
      <View style={styles.buttonBottomHeader}>
        <TouchableOpacity style={styles.resourceButton} onPress={() => Linking.openURL(event?.url)}>
          <Text style={styles.resourceButtonText}>Register on Website</Text>
        </TouchableOpacity>
      </View> 
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  seeText: {
    fontFamily: 'mon-sb',
    color: Colours.primary
  },
  buttonBottomHeader: {
    borderTopWidth: StyleSheet.hairlineWidth, 
    borderTopColor: '#c2c2c2',
    paddingTop: 25,
    paddingHorizontal: 15,

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
    width,
    height: IMG_HEIGHT
  },
  detailRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  subheader: {
    fontSize: 22, 
    marginTop: 25,
    fontFamily: 'mon-sb',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontFamily: 'mon-b',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10
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
  header: {
    backgroundColor: '#fff',
    height: height * 0.15,
    borderBottomColor: Colours.grey,
    borderWidth: StyleSheet.hairlineWidth
  },
  date: {
    fontFamily: 'mon-sb',
    fontSize: 16,
    color: '#fff'
  },
  productCard: {
    backgroundColor: Colours.primary,
    padding: 5,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
    height: 60
  },
  details: {
    marginTop: 5,
    gap: 10,
    justifyContent: 'flex-start'
  },
  resourceButton: {
    backgroundColor: Colours.primary,
    padding: 20,
    marginBottom: 50,
    borderRadius: 12.5,
    alignItems: 'center',
  },
  resourceButtonText: {
    color: 'white',
    fontFamily: 'mon-b',
    fontSize: 18,
  },
})

export default Page