import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ImageSourcePropType, Button, Linking } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import categoryData from '@/assets/data/categories.json'
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated'
import { Feather, FontAwesome5, FontAwesome6, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Colours } from '@/constants/Colours'
import MapView, { Marker } from 'react-native-maps'
import axios from 'axios'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Location from 'expo-location'


const IMG_HEIGHT = 300
const { height, width } = Dimensions.get('window')

interface DataItem {
    latitude: string;
    longitude: string;
    organization: string;
    type: string;
    [key: string]: string;
}

interface ImageDictionary {
  [key: string]: ImageSourcePropType;
}

interface MarkerDictionary {
  [key: string]: string
}

const images: ImageDictionary = {
  reuse: require('@/assets/images/keyword_images/reuse.png'),
  recycle: require('@/assets/images/keyword_images/recycle.png'),
  redesign: require('@/assets/images/keyword_images/redesign.png'),
  repair: require('@/assets/images/keyword_images/repair.png'),
  refurbish: require('@/assets/images/keyword_images/refurbish.png'),
  remanufacture: require('@/assets/images/keyword_images/remanufacture.png'),
  recover: require('@/assets/images/keyword_images/recover.png'),
  resell: require('@/assets/images/keyword_images/resell.png'),
  refill: require('@/assets/images/keyword_images/refill.png'),
  borrow: require('@/assets/images/keyword_images/borrow.png'),
}

const markerColours: MarkerDictionary = {
  reuse: '#FF5733',
  recycle: Colours.primary,
  redesign: '#CF9FFF',
  repair: Colours.grey,
  refurbish: '#FF768B',
  remanufacture: '#0096FF',
  recover: '#33A1FF',
  resell: '#FFC000',
  refill: '#33FF57',
  borrow: '#3357FF',
}


const Page = () => {
  const { name } = useLocalSearchParams<{name: string}>()
  const navigation = useNavigation()
  const [data, setData] = useState<DataItem[]>([])
  const [selectedPlace, setSelectedPlace] = useState<DataItem | null>(null)
  const  [openSheet, setOpenSheet] = useState(false)
  const [mapRegion, setMapRegion] = useState({
    latitude: 43.2557,
    longitude: -79.8711,
    latitudeDelta: 0.175,
    longitudeDelta: 0.175,
  })
  const [userLocation, setUserLocation] = useState<{ latitude: number | null, longitude: number | null }>({
    latitude: null,
    longitude: null
  })
  
  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);

  const snapPoints = useMemo(() => ['10%', '40%'], [])

  const handleSheetChange = useCallback((index: any) => {
    index === 1 ? (setOpenSheet(true)) : (setOpenSheet(false))
  }, [])

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({})

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })

    }

    getLocation();
  }, []);



  useEffect(() => {
    selectedPlace && (
      animateRegion({
        lat: Number(selectedPlace.latitude), 
        long: Number(selectedPlace.longitude),
        openSheet
      })
    )
  }, [selectedPlace, openSheet]);

  const handleSnapPress = useCallback((index: any) => {
    sheetRef.current?.snapToIndex(index);
  }, [])
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, [])


  const fetchData = async () => {
    try {
      const response = await axios.get<DataItem[]>('https://raw.githubusercontent.com/willcagas/wastebuster-public-database/main/public-database-2023.json');
 
      setData(response.data.filter(item => name == item.category))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.roundBtn} onPress={() => navigation.goBack()}>
          <Ionicons name='chevron-back' size={24} color={'#000'} />
        </TouchableOpacity>
      )
    })
  })

  const SymbolKeywordImage = ({ item }: {item: DataItem}) => {
    const symbolKey = item.type.toLowerCase().trim()
    const imageSource = images[symbolKey]
    
    if (imageSource) {
      return <Image source={imageSource} style={selectedPlace === item ? {width: 40, height: 40} : {width: 25, height: 25}}  />;
    } else {
      console.error(`No image found for Symbol Keyword: "${item.type}"`);
      return (
        <View style={{width: 20, height: 20, backgroundColor: 'red'}}>
          <Text style={{fontSize: 10, color: 'white'}}>!</Text>
        </View>
      )
    }
  }

  const animateRegion = ({lat, long, openSheet}: {lat: number, long: number, openSheet: boolean}) => {
    const latitudeOffset = openSheet ? 0.002: 0

    mapRef.current?.animateToRegion({
      latitude: lat - latitudeOffset,
      longitude: long,
      latitudeDelta: openSheet ? 0.00625 : 0.075,
      longitudeDelta: openSheet ? 0.00625 : 0.075,
    }, 500);
  }

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text)
  }

  return (
    <View style={styles.container}>
      <GestureHandlerRootView >
        <MapView
          ref={mapRef}
          style={styles.map}
          region={mapRegion}
        >
          {/* {data.map((item, index) => {
              const lat = Number(item.latitude)
              const long = Number(item.longitude)
            
              if (isNaN(lat) || isNaN(long)) {
                  // console.warn(`Invalid coordinates for item at org ${item.Organization}`)
                  return null
              }

              return (
                  <Marker
                      key={index}
                      coordinate={{latitude: lat, longitude: long}}
                      onPress={() => {setSelectedPlace(item), Haptics.selectionAsync()}}
                  >
                    <View style={selectedPlace === item ? styles.markerBtnActive : styles.markerBtn}>
                      <SymbolKeywordImage item={item} />
                    </View>
                  </Marker>
              );
          })} */}
          {Object.values(data.reduce((acc: {[key: string]: DataItem}, item) => {
            const key = `${item.latitude},${item.longitude}`
            
            acc[key] = acc[key] ? acc[key] : item

            return acc
          }, {})).map((item: DataItem, index: number) => {
            const lat = Number(item.latitude)
            const long = Number(item.longitude)

            if (isNaN(lat) || isNaN(long)) {
              return null
            }

            return (
              <Marker
                key={`${lat}-${long}-${index}`}
                coordinate={{latitude: lat, longitude: long}}
                onPress={() => {
                  setSelectedPlace(item)
                  Haptics.selectionAsync()
                }}
              >
                <View 
                style={selectedPlace === item ? [styles.markerBtn, { backgroundColor: markerColours[item.type.toLowerCase().trim() as any], borderRadius: 30}] : [styles.markerBtn, { backgroundColor: markerColours[item.type.toLowerCase().trim() as any]}]}>
                  <SymbolKeywordImage item={item} />
                </View>
              </Marker>
            )
          })}

          {userLocation && (
           <Marker coordinate={{latitude: Number(userLocation.latitude), longitude: Number(userLocation.longitude)}}
           onPress={() => {
            <View>
              <Text>
                You are here!
              </Text>
            </View>
           }}
           />
          )}
        </MapView>
        
        {
          selectedPlace && (
            <BottomSheet
              ref={sheetRef}
              snapPoints={snapPoints}
              onChange={(index) => {
                handleSheetChange(index);
                setOpenSheet(index > 0);
              }}
              index={0}
            >
              <BottomSheetView style={styles.bottomSheetContainer}>
                 
                  <Text style={styles.bottomSheetHeader}>{selectedPlace.organization} </Text>

                  <SafeAreaView style={{flex: 1, justifyContent: 'flex-end'}}>
                    <View style={styles.firstRowProperty}>
                      <View style={styles.firstRow}>
                        <MaterialIcons name="category" size={27} color="black" />
                        <Text style={styles.bottomSheetText}>{selectedPlace.category}</Text>
                      </View>

                      <View style={styles.firstRow}>
                        <MaterialIcons name="format-list-bulleted" size={27} color="black" />
                        <Text style={styles.bottomSheetText}>{selectedPlace.type}</Text>
                      </View>
                    </View>
                  
                    <View style={styles.separator} />

                    <TouchableOpacity style={styles.buttonContainer} onPress={() => copyToClipboard(selectedPlace.address)}>
                      <View style={styles.buttonContent}>
                        <Fontisto name="map" size={20} color="black" />
                        <Text style={styles.bottomSheetText}>{selectedPlace.address.slice(0, -8).replace(/\s+/g, ' ').trim()}</Text>
                      </View>
                      
                      <MaterialCommunityIcons name="content-copy" size={18} color="black" style={styles.rightBtn}/>
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <TouchableOpacity style={styles.buttonContainer} onPress={() => Linking.openURL(`tel:${selectedPlace.phone_number}`)}>
                      <View style={styles.buttonContent}>
                        <FontAwesome5 name="phone-alt" size={22} color="black" />
                        <Text style={styles.bottomSheetText}>{selectedPlace.phone_number.trimStart()}</Text>
                      </View>
                      
                      <Feather name="arrow-up-right" size={20} color="black" style={styles.rightBtn} />
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <TouchableOpacity style={styles.buttonContainer} onPress={() => Linking.openURL(selectedPlace.website)}>
                      <View style={styles.buttonContent}>
                        <Ionicons name="globe-outline" size={25} color="black" />
                        <Text style={styles.bottomSheetText}>Website</Text>

                      </View>
                      
                      <Feather name="arrow-up-right" size={20} color="black" style={styles.rightBtn} />
                    </TouchableOpacity>
                  </SafeAreaView>                
              </BottomSheetView>
            </BottomSheet>
          )
        }
      </GestureHandlerRootView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%'
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
  markerBtn: {
    borderRadius: 20,
    padding: 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  firstRow: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 19
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E0E0', 
    right: 0, 
    width: '95%', 
    alignSelf: 'center'
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 12,
    paddingTop: 5,
    gap: 5,
    justifyContent: 'flex-start', 
  },
  bottomSheetHeader: {
    fontFamily: 'mon-b',
    fontSize: 16,
    alignSelf: 'center',
  },
  bottomSheetText: {
    fontFamily: 'mon-sb',
    fontSize: 14,
  },
  firstRowProperty: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingVertical: 20,
    justifyContent: 'flex-start',
    gap: 45
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingVertical: 20,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    position: 'relative'
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 20
  },
  rightBtn: {
    position: 'absolute', 
    justifyContent: 'center', 
    right: 0, 
    marginRight: 7.5
  },
})

export default Page