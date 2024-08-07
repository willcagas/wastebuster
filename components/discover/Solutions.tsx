import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, Image, ImageSourcePropType, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { Link } from 'expo-router';
import categoryData from '@/assets/data/categories.json'
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { Ionicons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colours } from '@/constants/Colours';

interface DataItem {
  [key: string]: string;
}

interface CategoryProps {
  id: number, 
  name: string, 
  associated: string[]
}

interface Props {
  search: string;
}

interface ImageDictionary {
  [key: string]: ImageSourcePropType;
}

const images: ImageDictionary = {
  appliances: require('@/assets/images/category_images/appliances.png'),
  bicycles: require('@/assets/images/category_images/bicycles.png'),
  books: require('@/assets/images/category_images/books.png'),
  cars: require('@/assets/images/category_images/cars.png'),
  ecofriendly: require('@/assets/images/category_images/ecofriendly.png'),
  electronics: require('@/assets/images/category_images/electronics.png'),
  fillery: require('@/assets/images/category_images/fillery.png'),
  food: require('@/assets/images/category_images/food.png'),
  footwear: require('@/assets/images/category_images/footwear.png'),
  furniture: require('@/assets/images/category_images/furniture.png'),
  hazardousmaterials: require('@/assets/images/category_images/hazardousmaterials.png'),
  metals: require('@/assets/images/category_images/metals.png'),
  office: require('@/assets/images/category_images/office.png'),
  plastics: require('@/assets/images/category_images/plastics.png'),
  sports: require('@/assets/images/category_images/sports.png'),
  textiles: require('@/assets/images/category_images/textiles.png'),
  tools: require('@/assets/images/category_images/tools.png'),
  toys: require('@/assets/images/category_images/toys.png'),
}

const numColumns = 2
const screenWidth = Dimensions.get('window').width
const itemWidth = (screenWidth - 20) / numColumns

const DataScreen = ({ search }:Props) => {
  const [data, setData] = useState<DataItem[]>([])

  const SymbolKeywordImage = ({ item }: { item: CategoryProps }) => {
    const symbolKey = item.name.toLowerCase().replace(/\s/g, '')
    const imageSource = images[symbolKey];

    return (
      <Image
        style={styles.image}
        source={imageSource || require('@/assets/images/miscellaneous/placeholder.png')}
        resizeMode="contain"
      />
    )
  }


  const fetchData = async () => {
    try {
      const response = await axios.get<DataItem[]>('https://raw.githubusercontent.com/willcagas/wastebuster-public-database/main/public-database-2023.json');
      setData(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Request made but no response received:', error.request);
        }
      } else {
        console.error('Unknown error:', error);
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const renderItem = ({ item }: { item: CategoryProps }) => {
    const isOdd = item.id % 2 !== 0;
    
    return (
      <View 
        style={[
          styles.container, 
          { width: itemWidth },
          isOdd ? { marginRight: 10, marginLeft: 5 } : { marginLeft: 10, marginRight: 5} 
        ]}
      >
        <Link href={`/category/${item.name}`} asChild>
          <TouchableOpacity activeOpacity={0.7} delayPressIn={0} >
            <View style={styles.category}>
              <View style={{flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',}} >
                {/* <MaterialIcons name='keyboard-arrow-right' size={60} color='#fff'/> */}

              
                <Image style={{width: 215, height: 215, position: 'absolute', right: 0, top: 0, borderTopRightRadius: 15}}
                 source={require('@/assets/images/miscellaneous/splash.png')} resizeMode="contain" />

                <SymbolKeywordImage item={item}/>
              </View> 

              <View style={styles.description}>
                <Text style={styles.name}>{item.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    )
  }

  const filteredItems = useMemo(() => 
    categoryData.filter(item => 
      item.name?.toLowerCase().includes(search?.toLowerCase() ?? '') || 
      item.associated.some(assoc => assoc.toLowerCase().includes(search?.toLowerCase() ?? ''))
    ),
    [search]
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        indicatorStyle="black"
        numColumns={numColumns}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Image style={{height: '35%', width: '50%'}} source={require('@/assets/images/miscellaneous/empty_image.png')} />

            <Text style={{ fontFamily: 'mon-b', fontSize: 17.5, color: Colours.grey}}>
              Nothing here to show...
            </Text>
          </View>
        )} 
        contentContainerStyle={styles.flatListContent}
      />
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5,
  },
  flatListContent: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 10
  },
  category: {
    flex: 1,
    height: itemWidth - 16,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    borderColor: '#e2e2e2',
    borderWidth: StyleSheet.hairlineWidth,

    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 1,
      height: 1
    }
  },
  emptyContainer: { 
    flex: 1, 
    alignItems: 'center', 
    paddingTop: 35,
    gap: 12.5
  },
  image: {
    width: 95,
    height: 82.5,
    position: 'absolute',
    top: 5,
    right: 5,
  },
  coloredSide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 0,
    width: '30%',
    height: '100%',
    backgroundColor: Colours.primary, 
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  name: {
    fontFamily: 'mon-b', 
    fontSize: 18,
    paddingTop: 10,
  },
  description: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 12.5,
    paddingLeft: 12.5,
    
  }
})

export default DataScreen