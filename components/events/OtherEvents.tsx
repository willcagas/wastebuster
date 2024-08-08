import { View, Text, Linking, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import Animated from 'react-native-reanimated';
import { Colours } from '@/constants/Colours';
import * as Haptics from 'expo-haptics';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import axios from 'axios';

interface Props {
  refresh: boolean
}

interface DataItem {
  id: number,
  name: string,
  description: string,
  organization: string,
  date: string,
  duration: number,
  type: string,
  location: string,
  address: string,
  image: string,
  url: string,
  [key: string]: string | number
}

type ItemId = string | number;

const { height, width } = Dimensions.get('window')

const SAVED_ITEM_IDS_KEY = '@MyApp:likedItemIds';

async function getSavedItemIds(): Promise<ItemId[]> {
  try {
    const savedIdsJson = await AsyncStorage.getItem(SAVED_ITEM_IDS_KEY);
    return savedIdsJson ? JSON.parse(savedIdsJson) : [];
  } catch (error) {
    console.error('Error getting saved item IDs:', error);
    return [];
  }
}

async function saveItemId(id: ItemId): Promise<void> {
  try {
    const savedIds = await getSavedItemIds();
    if (!savedIds.includes(id)) {
      savedIds.push(id);
      await AsyncStorage.setItem(SAVED_ITEM_IDS_KEY, JSON.stringify(savedIds));
    }
  } catch (error) {
    console.error('Error saving item ID:', error);
  }
}

async function removeItemId(id: ItemId): Promise<void> {
  try {
    const savedIds = await getSavedItemIds();
    const updatedIds = savedIds.filter(savedId => savedId !== id);
    await AsyncStorage.setItem(SAVED_ITEM_IDS_KEY, JSON.stringify(updatedIds));
  } catch (error) {
    console.error('Error removing item ID:', error);
  }
}

const calculateDaysFromNow = (isoDateString: string): number => {
  const targetDate = new Date(isoDateString)
  const currentDate = new Date();
  const differenceInMs = targetDate.getTime() - currentDate.getTime();

  return Math.ceil(differenceInMs / (1000 * 60 * 60 * 24))
}

const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

const UpcomingEvents = ( {refresh}: Props) => {
  const [loading, setLoading] = useState(false);
  const [savedItems, setSavedItems] = useState<ItemId[]>([])
  const [likedFilter, setLikedFilter] = useState(false)
  const [data, setData] = useState<DataItem[]>([])

  const fetchDataAndLoadSavedItems = async () => {
    setLoading(true);
    try {
      const [response, savedIds] = await Promise.all([
        axios.get<DataItem[]>('https://raw.githubusercontent.com/willcagas/wastebuster-public-database/main/public-events.json'),
        getSavedItemIds()
      ]);

      setData(response.data);
      setSavedItems(savedIds);
    } catch (error) {
      console.error('Error fetching data or loading saved items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAndLoadSavedItems();

    console.log('loading')
  }, [refresh])

  const toggleSaved = async (id: ItemId) => {
    savedItems.includes(id)
    ? (await removeItemId(id), setSavedItems(prevItems => prevItems.filter(itemId => itemId !== id)))
    : (await saveItemId(id), setSavedItems(prevItems => [...prevItems, id]));
  }

  const renderRow = useCallback(({ item }: { item: any }) => (
    <View>
      <Link href={`/event/${item.id}`} asChild>
        <TouchableOpacity activeOpacity={0.7}>
          <Animated.View style={styles.idea}>
            <View style={styles.otherContainer}>
              <Animated.Image
                source={
                  item.image
                    ? { uri: item.image }
                    : require('@/assets/images/miscellaneous/placeholder.png')
                }
                style={styles.island}
                resizeMode="cover"
              />

              <TouchableOpacity
                  style={styles.roundBtn}
                  onPress={async () => {
                    await toggleSaved(item.id);
                    await Haptics.selectionAsync();
                  }}
                >
                  <AntDesign
                    name={savedItems.includes(item.id) ? 'heart' : 'hearto'}
                    size={25}
                    color={savedItems.includes(item.id) ? '#ff0000' : '#000'}
                  />
              </TouchableOpacity>

              <View style={styles.textBox}>
                <Animated.Text style={styles.textHeader}>{item.name}</Animated.Text>
                <Animated.Text style={styles.textDate}>{formatDate(item?.date)}</Animated.Text>
              </View>              

              <Animated.Image
                source={
                  item?.organization === "Green Venture" && require('@/assets/images/miscellaneous/placeholder.png')
                  || item?.organization === "Hamilton Naturalists' Club" && require('@/assets/images/miscellaneous/HNCLogo.png')
                }
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    </View>
  ), [savedItems, toggleSaved]);

  const sortedEventsData = data
  .filter(item => item.date && calculateDaysFromNow(item.date) > 7 && (likedFilter ? savedItems.includes(item.id) : true))
  .sort((a, b) => calculateDaysFromNow(a.date!) - calculateDaysFromNow(b.date!));


  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View>
          <Text style={styles.subheader}>Explore More</Text>
        </View>
        
        <View>
          <TouchableOpacity 
            onPress={() => {setLikedFilter(!likedFilter), Haptics.impactAsync()}}
            style={[likedFilter ? styles.categoriesBtnActive : styles.categoriesBtn, { paddingHorizontal: 7.5 }]}
          >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 5}}>
              <AntDesign name={'hearto'} size={17} color={likedFilter ? '#fff' : Colours.grey}/>
              <Text 
                style={likedFilter ? styles.categoryTextActive : styles.categoryText}
              >
                Liked
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <FlashList
          showsVerticalScrollIndicator={false}
          data={sortedEventsData} 
          renderItem={renderRow}
          estimatedItemSize={20}
          ListEmptyComponent={() => (
            loading === false ? (
              <View style={styles.emptyContainer}>
                <Image style={{height: '50%', width: '30%'}} source={require('@/assets/images/miscellaneous/empty_image.png')} />
    
                <Text style={{ fontFamily: 'mon-b', fontSize: 15, color: Colours.grey}}>
                  Nothing here to show...
                </Text>
              </View>
            ) : null
          )} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    height: 225,
    gap: 10,
    marginTop: 30
  },
  otherContainer: {
    backgroundColor: '#fff', 
    borderRadius: 20, 
    flexDirection: 'row',
    borderColor: '#e2e2e2',
    borderWidth: StyleSheet.hairlineWidth,

    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1
    }
  },
  idea: {
    padding: 10,
    paddingLeft: 16,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingLeft: 2,
    paddingRight: 15,
    paddingBottom: 7.5,
  },
  header: {
    fontFamily: 'mon-b',
    fontSize: 24,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  subheader: {
    fontFamily: 'mon-sb',
    fontSize: 16,
    paddingHorizontal: 15,
    
  },
  island: {
    padding: 30,
    paddingTop: 20,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    height: 125,
    width: '35%',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    borderColor: '#fff',
    borderWidth: 5,
  },
  roundBtn: {
    width: 38,
    height: 38,
    position: 'absolute',
    top: '7.5%',
    right: '2.5%',
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
    color: '#000',
  },
  youtube_ico: {
    flex: 1,
    alignSelf: 'center',
    position: 'absolute',
    top: '20%',
    height: 150,
    width: 150,
  },
  textBox: {
    paddingLeft: 7.5,
    width: '50%',
    top: '3%',
  },
  textHeader: {
    fontFamily: 'mon-b',
    color: '#000',
    fontSize: 12.75,
  },
  textDate: {
    fontFamily: 'mon-sb',
    paddingTop: 7.5,
    color: Colours.primary,
    fontSize: 12.5,
  },
  logo: {
    flex: 1,
    width: 62.5,
    height: 37.5,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: '7.5%',
    right: '2.5%',
  },
  categoryText: {
    fontSize: 13,
    fontFamily: 'mon-sb',
    color: Colours.grey,
  },
  categoryTextActive: {
    fontSize: 13,
    fontFamily: 'mon-sb',
    color: '#fff',
  },
  categoriesBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    paddingHorizontal: 7.5,
    borderWidth: 1,
    borderColor: Colours.grey,
    borderRadius: 25,
    backgroundColor: '#fff'
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    paddingHorizontal: 7.5,
    borderWidth: 1,
    borderColor: '#ff0000',
    borderRadius: 25,
    backgroundColor: '#ff0000'
  }
});

export default UpcomingEvents;
