import { View, Text, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import eventsData from '@/assets/data/events.json';
import { FlashList } from '@shopify/flash-list';
import Animated from 'react-native-reanimated';
import { Colours } from '@/constants/Colours';
import * as Haptics from 'expo-haptics';
import { AntDesign } from '@expo/vector-icons';
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
            <View>
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
                  size={30}
                  color={savedItems.includes(item.id) ? '#ff0000' : '#000'}
                />
              </TouchableOpacity>
              
              <View style={styles.textBox}>
                <Animated.Text style={styles.textHeader}>{item.name}</Animated.Text>

                <Animated.Text style={styles.textDate}>In {calculateDaysFromNow(item?.date)} days</Animated.Text>
              </View>
              
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    </View>
  ), [savedItems, toggleSaved]);

  const sortedEventsData = eventsData
  .filter(item => item.date && calculateDaysFromNow(item.date) <= 7)
  .sort((a, b) => calculateDaysFromNow(a.date!) - calculateDaysFromNow(b.date!));

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.subheader}>Upcoming</Text>
      </View>
      <FlashList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={sortedEventsData}
        renderItem={renderRow}
        estimatedItemSize={20}
        extraData={savedItems}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  idea: {
    padding: 10,
    paddingLeft: 15,
  },
  heading: {
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
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
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  island: {
    borderRadius: 20,
    height: 275,
    width: 275,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  roundBtn: {
    width: 45,
    height: 45,
    position: 'absolute',
    top: '5%',
    right: '5%',
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
  textBox: {
    position: 'absolute',
    paddingLeft: 7.5,
    bottom: '2.5%'
  },
  textHeader: {
    fontFamily: 'mon-b',
    paddingTop: 2,
    color: '#fff',
    fontSize: 15,
  },
  textDate: {
    fontFamily: 'mon-sb',
    paddingTop: 2,
    color: '#fff',
    fontSize: 14,
  },
});

export default UpcomingEvents;
