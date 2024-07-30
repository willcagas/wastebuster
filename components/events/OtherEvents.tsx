import { View, Text, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import eventsData from '@/assets/data/events.json';
import { FlashList } from '@shopify/flash-list';
import Animated from 'react-native-reanimated';
import { Colours } from '@/constants/Colours';
import * as Haptics from 'expo-haptics';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';

type ItemId = string | number;

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

 
const UpcomingEvents = () => {
  const [loading, setLoading] = useState(false);
  const [savedItems, setSavedItems] = useState<ItemId[]>([]);

  useEffect(() => {
    const loadSavedItems = async () => {
      setLoading(true);
      try {
        const ids = await getSavedItemIds();
        setSavedItems(ids);
      } catch (error) {
        console.error('Error loading saved items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedItems();
  }, []);

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
                    : require('@/assets/images/placeholder.png')
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
                source={item?.organization === "Green Venture" && require('@/assets/images/placeholder.png')}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    </View>
  ), [savedItems, toggleSaved]);

  const sortedEventsData = eventsData
  .filter(item => item.date && calculateDaysFromNow(item.date) > 7)
  .sort((a, b) => calculateDaysFromNow(a.date!) - calculateDaysFromNow(b.date!));


  return (
    <View style={styles.container}>
      <View style={styles.heading}>
          <Text style={styles.subheader}>Other</Text>
          <MaterialIcons name="filter-list" size={28} color="black" style={{marginRight: 20}}/>
      </View>
      <FlashList
          showsVerticalScrollIndicator={false}
          data={sortedEventsData} 
          renderItem={renderRow}
          estimatedItemSize={20}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  otherContainer: {
    backgroundColor: '#fff', 
    borderRadius: 20, 
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  idea: {
    padding: 10,
    paddingLeft: 15,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingBottom: 1
  },
  header: {
    fontFamily: 'mon-b',
    fontSize: 24,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  subheader: {
    fontFamily: 'mon-sb',
    fontSize: 18,
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
    width: '55%',
    top: '3%'
  },
  textHeader: {
    fontFamily: 'mon-b',
    color: '#000',
    fontSize: 12.25,
  },
  textDate: {
    fontFamily: 'mon-sb',
    paddingTop: 5,
    color: Colours.grey,
    fontSize: 14,
  },
  logo: {
    width: 55,
    height: 30,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: '7.5%',
    right: '2.5%',
  }
});

export default UpcomingEvents;
